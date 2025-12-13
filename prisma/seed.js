import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const creatorId = 'f8509f4e-78bd-4486-afe8-2d83fe37584d'

const movies = [
    {
        title: "the Matrix",
        overview: "A computer hacker learns about the true nature of reality while on a death mission.",
        releaseyear: 1999,
        genres: ["Action", "Sci-Fi"],
        runtime: 136,
        posterUrl: "https://example.com/matrix.jpg",
        createdBy: creatorId,
        director: "The Wachowskis"
    },
    {
        title: "The Godfather",
        overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
        releaseyear: 1972,
        genres: ["Crime", "Drama"],
        runtime: 175,
        posterUrl: "https://example.com/godfather.jpg",
        createdBy: creatorId,
        director: "Francis Ford Coppola"
    },
    {
        title: "The Dark Knight",
        overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, the caped crusader must come to terms with one of the greatest psychological and physical tests of his ability to fight injustice.",
        releaseyear: 2008,
        genres: ["Action", "Crime", "Drama", "Thriller"],
        runtime: 152,
        posterUrl: "https://example.com/dark-knight.jpg",
        createdBy: creatorId,
        director: "Christopher Nolan"
    },
    {
        title: "The Godfather: Part II",
        overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
        releaseyear: 1974,
        genres: ["Crime", "Drama"],
        runtime: 202,
        posterUrl: "https://example.com/godfather-ii.jpg",
        createdBy: creatorId,
        director: "Francis Ford Coppola"
    },
    {
        title: "The Lord of the Rings: The Return of the King",
        overview: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
        releaseyear: 2003,
        genres: ["Action", "Adventure", "Drama"],
        runtime: 201,
        posterUrl: "https://example.com/lotr.jpg",
        createdBy: creatorId,
        director: "Peter Jackson"
    },
    {
        title: "The Shawshank redemption",
        overview: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
        releaseyear: 1994,
        genres: ["Drama"],
        runtime: 142,
        posterUrl: "https://example.com/lotr.jpg",
        createdBy: creatorId,
        director: "Frank Darabont"
    }
]
const main = async () => {
    console.log('seeding movies ...');

    for (const movie of movies) {
        await prisma.movie.create({ data: movie })
        console.log(`Created movie ${movie.title}`)
    }
    console.log('seeding movies done')


}
main().catch((error) => {
    console.error("Error in seed:", error);
    process.exit(1);
}).finally(async () => {
    await prisma.$disconnect();
})

