self.addEventListener("message", (event) => {
    //η­εΎδ»
    const sharedArray = event.data;
    Atomics.wait(sharedArray, 2, "yideng2");
    console.log("π");
});