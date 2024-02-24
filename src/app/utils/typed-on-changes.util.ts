/**
 * Filtre les propriétés d'un composant pour enlever les clés private (parce qu'elles remontent pas avec Component[Key])
 * et les fonctions
 */

type MarkFunctionProperties<Component> = {
    [Key in keyof Component]: Component[Key] extends Function ? never : Key;
};

/**
 * Ce type accepte comme valeurs les clés non-fonctions non-private de T
 */
type ExcludedFunctionPropertyNames<T> = MarkFunctionProperties<T>[keyof T];

type ExcludeFunctions<T> = Pick<T, ExcludedFunctionPropertyNames<T>>;

/**
 * Etape finale : implémentation de SimpleChanges mais avec des clés limitées
 */

export type NgChanges<Component, Props = ExcludeFunctions<Component>> = {
    [Key in keyof Props]: {
        previousValue: Props[Key];
        currentValue: Props[Key];
        firstChange: boolean;
        isFirstChange(): boolean;
    };
};