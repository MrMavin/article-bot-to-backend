export const waitSeconds = async (seconds: number) => {
    return new Promise(res => setTimeout(res, 1000 * seconds));
};
