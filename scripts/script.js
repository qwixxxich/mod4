document.addEventListener("DOMContentLoaded", () => {
    const clock = document.querySelector("#clock");
    const updateClock = () => {
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        clock.textContent = `${hh}:${mm}`;
    };
    updateClock();
    setInterval(updateClock, 1000);

    const footerForm = document.querySelector(".footer__form");
    const footerSuccess = document.querySelector(".footer__success");

    footerForm?.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!footerForm.reportValidity()) return;

        footerForm.reset();
        footerSuccess.hidden = false;
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let smoothScrollFrame = 0;
    let smoothScrollTarget = window.scrollY;
    let smoothScrollCurrent = window.scrollY;
    let smoothScrollLastTime = 0;

    const getMaxScrollY = () => Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
    );
    const clampScrollY = (value) => Math.min(getMaxScrollY(), Math.max(0, value));
    const syncSmoothScroll = () => {
        const scrollY = clampScrollY(window.scrollY);
        smoothScrollTarget = scrollY;
        smoothScrollCurrent = scrollY;
    };
    const stopSmoothScroll = () => {
        if (smoothScrollFrame) {
            cancelAnimationFrame(smoothScrollFrame);
            smoothScrollFrame = 0;
        }

        smoothScrollLastTime = 0;
        syncSmoothScroll();
    };
    const getWheelDelta = (event) => {
        if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * 24;
        if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) return event.deltaY * window.innerHeight * 0.9;

        return event.deltaY;
    };
    const hasScrollableAncestor = (node) => {
        let current = node instanceof Element ? node : null;

        while (current && current !== document.body) {
            const { overflowY } = getComputedStyle(current);
            const canScroll = /(auto|scroll|overlay)/.test(overflowY);

            if (canScroll && current.scrollHeight > current.clientHeight + 1) return true;

            current = current.parentElement;
        }

        return false;
    };
    const animateSmoothScroll = (time) => {
        if (!smoothScrollLastTime) smoothScrollLastTime = time;

        const interpolation = 1 - Math.exp(-(time - smoothScrollLastTime) / 60);
        smoothScrollCurrent += (smoothScrollTarget - smoothScrollCurrent) * interpolation;
        smoothScrollCurrent = clampScrollY(smoothScrollCurrent);
        window.scrollTo(0, smoothScrollCurrent);

        if (Math.abs(smoothScrollTarget - smoothScrollCurrent) < 0.5) {
            window.scrollTo(0, smoothScrollTarget);
            smoothScrollFrame = 0;
            smoothScrollLastTime = 0;
            syncSmoothScroll();
            return;
        }

        smoothScrollLastTime = time;
        smoothScrollFrame = requestAnimationFrame(animateSmoothScroll);
    };
    const handleSmoothWheel = (event) => {
        if (reducedMotion.matches || event.ctrlKey || hasScrollableAncestor(event.target)) {
            stopSmoothScroll();
            return;
        }

        event.preventDefault();

        if (!smoothScrollFrame) syncSmoothScroll();

        smoothScrollTarget = clampScrollY(smoothScrollTarget + getWheelDelta(event) * 0.7);

        if (!smoothScrollFrame) {
            smoothScrollCurrent = window.scrollY;
            smoothScrollLastTime = 0;
            smoothScrollFrame = requestAnimationFrame(animateSmoothScroll);
        }
    };

    window.addEventListener("wheel", handleSmoothWheel, { passive: false });
    window.addEventListener("scroll", () => {
        if (!smoothScrollFrame) syncSmoothScroll();
    }, { passive: true });
    window.addEventListener("resize", stopSmoothScroll);
    window.addEventListener("touchstart", stopSmoothScroll, { passive: true });

    const orbitArea = document.querySelector(".orbits");
    if (orbitArea) {
        const rings = document.querySelectorAll(".rings .ring");
        const movers = [];
        document.querySelectorAll(".orbits .orbit").forEach((orbit, i) => {
            const ring = rings[i];
            const labelRing = rings[i + 1];
            const planet = orbit.querySelector(".planet");
            const label = orbit.querySelector(".orbit__label");
            if (!ring || !planet) {
                if (planet) planet.style.display = "none";
                if (label) label.style.display = "none";
                return;
            }
            if (label && !labelRing) label.style.display = "none";
            movers.push({
                ring,
                labelRing,
                planet,
                label: labelRing ? label : null,
                ringZ: parseInt(getComputedStyle(ring).zIndex, 10) || 0,
                angle: Math.random() * Math.PI * 2,
                speed: 0.03 + Math.random() * 0.04,
            });
        });

        let prev = performance.now();
        const tickPlanets = (now) => {
            const dt = Math.min((now - prev) / 1000, 0.1);
            prev = now;
            const area = orbitArea.getBoundingClientRect();
            for (const m of movers) {
                const r = m.ring.getBoundingClientRect();
                const cx = r.left - area.left + r.width / 2;
                const cy = r.top - area.top + r.height / 2;
                m.angle += m.speed * dt;
                const sin = Math.sin(m.angle);
                m.planet.style.left = `${cx + (r.width / 2) * Math.cos(m.angle)}px`;
                m.planet.style.top = `${cy + (r.height / 2) * sin}px`;
                m.planet.style.zIndex = m.ringZ + (sin >= 0 ? 5 : -5);
                if (m.label) {
                    const lr = m.labelRing.getBoundingClientRect();
                    m.label.style.left = `${lr.left - area.left + lr.width / 2}px`;
                    m.label.style.top = `${lr.top - area.top + lr.height / 2}px`;
                }
            }
            requestAnimationFrame(tickPlanets);
        };
        requestAnimationFrame(tickPlanets);
    }

    const moon = document.getElementById("moon");
    const moonText = document.getElementById("moon-animation");
    const cardsSection = document.getElementById("second");
    const sceneSection = document.getElementById("third");

    if (moonText) {
        const frames = [];
        const parts = [
            { path: "assets/img/moon-anim/moving_to_left", count: 12 },
            { path: "assets/img/moon-anim/moving_to_right", count: 11 },
        ];
        for (const { path, count } of parts) {
            for (let i = 1; i <= count; i++) frames.push(`${path}/${i}.svg`);
            for (let i = count - 1; i >= 1; i--) frames.push(`${path}/${i}.svg`);
        }
        for (const frame of frames) new Image().src = frame;

        let current = 0;
        setInterval(() => {
            current = (current + 1) % frames.length;
            moonText.src = frames[current];
        }, 75);
    }

    if (moon && cardsSection && sceneSection) {
        const lerp = (a, b, t) => a + (b - a) * t;
        const placeMoon = () => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            // Синхронизировано с CSS-брейкпоинтом адаптивной вёрстки.
            const mobile = vw <= 1024;
            const from = mobile
                ? { cx: vw * 0.5, cy: vh * 0.26, w: vh * 0.5 }
                : { cx: vw * 0.02, cy: vh * 0.5, w: vh * 0.72 };
            const to = { cx: vw * 0.5, cy: vh * 0.62, w: vw * 0.48 };

            const start = cardsSection.offsetTop;
            const end = sceneSection.offsetTop;
            const y = window.scrollY;
            const p = Math.max(0, Math.min(1, (y - start) / (end - start)));
            const beforeStart = y < start;
            const completed = y >= end;

            const w = completed ? to.w : lerp(from.w, to.w, p);
            const cx = completed ? to.cx : lerp(from.cx, to.cx, p);
            const cy = completed ? to.cy : lerp(from.cy, to.cy, p);

            moon.style.position = beforeStart || completed ? "absolute" : "fixed";
            moon.style.width = `${w}px`;
            moon.style.left = `${cx - w / 2}px`;
            moon.style.top = `${
                beforeStart
                    ? cy - w / 2
                    : completed
                        ? end - start + cy - w / 2
                        : cy - w / 2
            }px`;
            moon.style.zIndex = completed ? "2" : "-1";
            moon.style.opacity = "1";
            moon.style.transform = mobile
                ? "none"
                : `rotate(${completed ? 0 : 180 * (1 - p)}deg)`;
            if (moonText) moonText.style.opacity = `${completed ? 1 : p}`;
        };
        placeMoon();
        window.addEventListener("scroll", placeMoon, { passive: true });
        window.addEventListener("resize", placeMoon);

        sceneSection.querySelectorAll(".button").forEach((button) => {
            button.addEventListener("mouseenter", () => {
                moon.classList.add("is-highlighted");
            });
            button.addEventListener("mouseleave", () => {
                moon.classList.remove("is-highlighted");
            });
        });
    }

    const popularCards = document.querySelectorAll(".card[data-product]");
    const popularDialog = document.querySelector("#popular-dialog");
    const popularCloseButton = popularDialog?.querySelector(".popular-dialog__close");
    const popularTitle = popularDialog?.querySelector(".popular-dialog__title");
    const popularImage = popularDialog?.querySelector(".popular-dialog__media");

    if (popularDialog && popularCloseButton && popularTitle && popularImage) {
        const openPopularDialog = (card) => {
            const tube = card.querySelector(".card__tube");

            popularTitle.textContent = card.dataset.product;
            popularImage.src = tube.src;
            popularImage.alt = tube.alt;
            popularDialog.showModal();
        };

        popularCards.forEach((card) => {
            card.addEventListener("click", (event) => {
                if (event.target.closest(".card__add")) return;

                openPopularDialog(card);
            });

            card.addEventListener("keydown", (event) => {
                if (event.target.closest(".card__add")) return;
                if (event.key !== "Enter" && event.key !== " ") return;

                event.preventDefault();
                openPopularDialog(card);
            });
        });

        popularCloseButton.addEventListener("click", () => popularDialog.close());
        popularDialog.addEventListener("click", (event) => {
            if (event.target === popularDialog) popularDialog.close();
        });
    }
});
