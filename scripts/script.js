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
