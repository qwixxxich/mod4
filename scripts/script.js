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
            const ring = rings[i + 1];
            const planet = orbit.querySelector(".planet");
            const label = orbit.querySelector(".orbit__label");
            if (!ring || !planet) {
                if (planet) planet.style.display = "none";
                if (label) label.style.display = "none";
                return;
            }
            movers.push({
                ring,
                planet,
                label,
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
                    m.label.style.left = `${cx}px`;
                    m.label.style.top = `${cy}px`;
                }
            }
            requestAnimationFrame(tickPlanets);
        };
        requestAnimationFrame(tickPlanets);
    }

    const animation = document.querySelector("#moon-animation");
    const frameDuration = 75;

    const frames = [];
    const parts = [
        { path: "assets/img/moon-anim/moving_to_left", count: 12 },
        { path: "assets/img/moon-anim/moving_to_right", count: 11 },
    ];

    for (const { path, count } of parts) {
        for (let i = 1; i <= count; i++) frames.push(`${path}/${i}.svg`);
        for (let i = count - 1; i >= 1; i--) frames.push(`${path}/${i}.svg`);
    }

    for (const frame of frames) {
        new Image().src = frame;
    }

    let current = 0;
    setInterval(() => {
        current = (current + 1) % frames.length;
        animation.src = frames[current];
    }, frameDuration);
});
