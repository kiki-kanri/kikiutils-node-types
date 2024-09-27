import type { ObjectId } from 'bson';

type ConditionalPath<K extends number | string, V, U> = V extends U ? `${K}` : DefaultPath<K, V, never>;
type DefaultPath<K extends number | string, V, RK = `${K}`> = V extends TerminalType ? RK : `${K}.${FilteredKeyPath<V>}`;
type IsTuple<T extends ReadonlyArray<any>> = number extends T['length'] ? false : true;
type PathImpl<K extends string | number, V, U> = [U] extends [never] ? DefaultPath<K, V> : ConditionalPath<K, V, U>;
type TerminalType = RegExp | Date | File | Blob | string | number | bigint | boolean | symbol | null | undefined | ObjectId;
type TupleKey<T extends ReadonlyArray<any>> = Exclude<keyof T, keyof any[]>;

declare global {
	/**
	 * A utility type that generates a union of key paths from a given object type `T`,
	 * filtered by a specific type `U`. If `U` is
	 * not provided, it defaults to including all key paths.
	 *
	 * @template T - The object type to traverse.
	 * @template U - The type used to filter key paths. Defaults to `never`, meaning no filtering.
	 */
	type FilteredKeyPath<T, U = never> =
		T extends ReadonlyArray<infer V> ? (IsTuple<T> extends true ? { [K in TupleKey<T>]-?: PathImpl<Exclude<K, symbol>, T[K], U> }[TupleKey<T>] : PathImpl<number, V, U>) : { [K in keyof T]-?: PathImpl<Exclude<K, symbol>, T[K], U> }[keyof T];
}