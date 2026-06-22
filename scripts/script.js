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
            const mobile = vw < 768;
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
            moon.style.transform = `rotate(${completed ? 0 : 180 * (1 - p)}deg)`;
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
});
