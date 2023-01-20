export const info = {
    winW: null,
    winH: null,
    winY: null,

    render() {
        this.winW = window.innerWidth;
        this.winH = window.innerHeight;
        this.winY = window.pageYOffset;
    },
};
