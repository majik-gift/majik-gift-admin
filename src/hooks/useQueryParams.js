import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const useQueryParams = () => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Serialize data to string for setting in URL
    const serialize = (data) => {
        try {
            return encodeURIComponent(JSON.stringify(data));
        } catch (error) {
            console.error('Failed to serialize data:', error);
            return '';
        }
    };

    // Deserialize string back to original form
    const deserialize = (data) => {
        if (!data) return null;
        try {
            return JSON.parse(decodeURIComponent(data));
        } catch (error) {
            console.error('Failed to deserialize data:', error);
            return null;
        }
    };

    // Function to get a query parameter and deserialize it
    const getQueryParam = useCallback(
        (name) => {
            const params = new URLSearchParams(searchParams.toString());
            const rawValue = params.get(name);
            return deserialize(rawValue);  // Convert the raw value back to its original form
        },
        [searchParams]
    );

    // Function to update a query parameter with serialized data
    const updateQueryParam = useCallback(
        (name, value) => {
            const params = new URLSearchParams(searchParams.toString());
            const serializedValue = serialize(value);  // Serialize the value to string
            params.set(name, serializedValue);

            // Push the updated URL with new query params
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [pathname, searchParams, router]
    );

    // Function to remove a query parameter
    const removeQueryParam = useCallback(
        (name) => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete(name);

            // Push the updated URL with query params removed
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
        },
        [pathname, searchParams, router]
    );

    return {
        getQueryParam,
        updateQueryParam,
        removeQueryParam,
    };
};

export default useQueryParams;
