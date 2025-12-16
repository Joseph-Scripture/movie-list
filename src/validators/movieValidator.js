
import { z } from 'zod';

export const createMovieSchema = z.object({
    title: z.string().min(1, "Title is required"),
    overview: z.string().optional(),
    genres: z.array(z.string()).optional(),
    runtime: z.number().int().positive("Runtime must be a positive integer").optional(),
    posterUrl: z.string().url("Poster URL must be a valid URL").optional(),
    director: z.string().min(1, "Director is required"),
    releaseyear: z.number().int().min(1888, "Year must be valid (movies started in 1888)").max(new Date().getFullYear() + 5, "Year cannot be too far in the future"),
});

export const updateMovieSchema = createMovieSchema.partial();
