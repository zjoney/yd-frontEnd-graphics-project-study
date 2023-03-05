self.addEventListener("message", (event) => {
    //等待他
    const sharedArray = event.data;
    Atomics.wait(sharedArray, 2, "yideng2");
    console.log("🍎");
});