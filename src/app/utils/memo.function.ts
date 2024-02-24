export function memo<T extends Function>(fnToMemoize: T): T {
    let prevArgs = [{}];
    let result: any;

    return function (...newArgs: any[]) {
        if (hasDifferentArgs(prevArgs, newArgs)) {
            prevArgs = newArgs;
            result = fnToMemoize(...newArgs);
        }
        return result;
    } as any;
}

function hasDifferentArgs(prev: unknown[], next: unknown[]): boolean {
    if (prev.length !== next.length) {
        return true;
    }
    return prev.some((arg, index) => arg !== next[index]);
}