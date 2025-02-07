const { initializeDatabase } = require("./db/db.connect")
const fs = require("fs")
const Book = require("./models/book.models")
const express = require("express")
const { error } = require("console")
initializeDatabase()

const app = express()
app.use(express.json())

async function seedBookData() {
    const jsonData = fs.readFileSync("book.json", "utf8")
    const booksData = JSON.parse(jsonData)

    try{
        for(const bookData of booksData){
            const newBook = new Book({
                title: bookData.title,
                author: bookData.author,
                publishedYear: bookData.publishedYear,
                genre: bookData.genre,
                language: bookData.language,
                country: bookData.country,
                rating: bookData.rating,
                summary: bookData.summary,
                coverImageUrl: bookData.coverImageUrl

            })
            newBook.save()
        }
    } catch (error) {
        console.log("Error seeding the data", error)
    }
}

// seedBookData()


// BE4_Assignment 1

// method 1 to add Books using only 'post' method

// app.post("/books", async (req, res) => {
//     try{
//         const newBook = new Book(req.body)
//         const savedBook = await newBook.save()
//         res.status(201).json({message: "Book added successfully.", book: savedBook})
//     }catch(error){
//         res.status(500).json({error: "Failed to add Book."})
//     }
// })


// Method 2 to add Books using 'Function' and 'Post' method

async function createBooks(newBook){
    try{
        const addedBook = new Book(newBook)
        const savedBook = await addedBook.save()
        return savedBook
    }catch(error){
        console.log("book not found.", error)
    }
}

app.post("/books", async(req, res) => {
    try{
        const addedBook = await createBooks(req.body)
        res.status(201).json({message: "Book added successfully.", book: addedBook})
    } catch(error){
        res.status(500).json({error: "failed to add book."})
    }
})

async function getBooks(){
    try{
       const books = await Book.find()
return books

    }catch(error){
       console.log(error)
    }
}

app.get("/books", async (req, res) => {
    try{
        const books = await getBooks()
        if(books.length !=0){
            res.json(books)
        } else {
            res.status(404).json({error: "Boooks not found"})
        }
    } catch(error){
        res.status(500).json({error: "Faild to get books"})
    }
})

async function getBookByTitle(bookTitle){
    try{
        const bookByTitle = await Book.findOne({title: bookTitle})
        return bookByTitle
    } catch(error){
        throw(error)
    }
}

app.get("/books/:bookTitle", async (req, res) => {
    try{
       const titleBook = await getBookByTitle(req.params.bookTitle)
       if(titleBook){
        res.status(200).json({message: "book found.", books: titleBook})
       }else {
        res.status(404).json({error: "Book not found."})
       }
    } catch(error){
        res.status(500).json({error: error.message})
    }
})

async function getBooksByAuthor(bookAuthor){
    try{
        const bookByAuthor = await Book.find({author: bookAuthor})
        return bookByAuthor
    } catch(error){
        console.log(error)
    }
}

app.get("/books/author/:bookAuthor",async (req, res) => {
    try{
        const fetchedbooks = await getBooksByAuthor(req.params.bookAuthor)
        if(fetchedbooks ){
            res.status(200).json({message: "Book found", book: fetchedbooks})
        } else {
            res.status(404).json("Book not found.")
        }
    } catch(error){
        res.status(500).json({error: "Error in fetching books"})
    }
})

async function getBooksByBussinessGenre(bookGenre){
    try{
        const book = await Book.findOne({genre: bookGenre})
        return book
    }catch(error){
        console.log(error)
    }
}

app.get("/books/genre/:bookGenre", async (req, res) => {
    try{
        const booksByGenre = await getBooksByBussinessGenre(req.params.bookGenre)
        if(booksByGenre){
            res.status(200).json({message: "Book by genre found", book: booksByGenre})
        } else {
            res.status(404).json({error: "Books not found by business genre."})
        }
    }catch(error){
        res.status(500).json({error: "error in fetching books."})
    }
})

async function getBooksByPublishedYear(year){
    try{
        const book = await Book.find({publishedYear: year})
        return book
    } catch(error){
        console.log(error)
    }
}

app.get("/books/publishedYear/:year", async (req, res) => {
    try{
        const booksByPublishedYear = await getBooksByPublishedYear(req.params.year)
        if(booksByPublishedYear){
            res.status(200).json({message: "Books found by published year 2012", book: booksByPublishedYear})
        } else {
            res.status(404).json({error: "Books not found"})
        }
    } catch(error){
        res.status(500).json({error: "Error in fetching Books."})
    }
})

async function updateBookById(bookId, updateData){
    try{
        const book = await Book.findByIdAndUpdate(bookId, updateData, {new:true})
        return book
    } catch(error){
        console.log(error)
    }
}

app.post("/books/updateBookRating/:bookId", async (req, res) => {
    try{
        const updatedBook = await updateBookById(req.params.bookId, req.body)
        if(updatedBook){
            res.status(200).json({message: "Book updated Successfully.", book: updatedBook})
        } else {
            res.status(404).json({error: "Book not found."})
        }
    }catch(error){
        res.status(500).json({error: "Error in updating books."})
    }
})

async function updateBookByTitle(bookTitle, updateBook){
    try{
        const book = await Book.findOneAndUpdate({title: bookTitle}, updateBook, {new: true})
        return book
    }catch(error){
        console.log(error)
    }
}

app.post("/books/updateBookByTitle/:bookTitle", async (req, res) => {
    try{
        const updatedBookBytitle = await updateBookByTitle(req.params.bookTitle, req.body)
        if(updatedBookBytitle){
            res.status(200).json({message: "Book details updated successfully.", book: updatedBookBytitle})
        } else {
            res.status(404).json({error: "Book not found."})
        }
    }catch(error){
        res.status(500).json({error: "Error in updating book details."})
    }
})

async function deleteBookById(bookId){
    try{
        const book = await Book.findByIdAndDelete(bookId)
        return book
    }catch(error){
        console.log(error)
    }
}

app.delete("/books/deleteBook/:bookId", async (req, res) => {
    try{
        const deletedBook = await deleteBookById(req.params.bookId)
        if(deletedBook){
            res.status(200).json({message: "Book deleted successfully."})
        }else{
            res.status(404).json({error: "Book not found"})
        }
    }catch(error){
        res.status(500).json({error: "Error in deleting book."})
    }
})

const PORT = 3000
app.listen(PORT, () => {
    console.log("Server is running on port", PORT)
})


