



const books = [] // Array untuk menyimpan data buku
const generateBookList = ('generateBookList'); // Costum Event
const SAVED_EVENT = 'saved_book'; // Costum Event
const STORAGE_KEY = 'BUKUKU'; // Nama key di local storage


// Membuat ID dengan fungsi new Date, 
// agar mendapatkan angka unik untuk setiap list buku.
function generateId() {
    return +new Date();
}
  

// Fungsi untuk membuat data buku, yang di simpan dalam object.
function generateBookObject(id, title, author, year, isCompleted) {
    return {
      id,
      title,
      author,
      year,
      isCompleted
    }
}


// fungsi untuk mencari buku yang sesuai dengan ID di array Books
function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
      } 
    }
        return null;
}


// Fungsi untuk mendapatkan nilai index dari array books
function findBookIndex(bookId) {
    for (const i in books) {
        if (books[i].id === bookId) {
        return i;
        }
    }
    return -1;
}


// Fungsi untuk memriksa local storage suport di browser. 
function isStorageExist(){
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}


// Fungsi untuk menyimpan data ke local storage.
function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books); //untuk mengubah data object mmenjadi string
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}


// Fungsi untuk memuat data dari local storage ke variabel books
function loadDataFromStorage() {
  const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(generateBookList));
}


// Fungsi untuk menambahkan list buku baru
function addBook() {
    const bookTitle = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const checkButton = document.querySelector('#inputBookIsComplete').checked;
   
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, bookTitle, bookAuthor,bookYear, checkButton);
    books.push(bookObject);
   
    document.dispatchEvent(new Event(generateBookList));
    saveData();
}


// Fungsi untuk membuat elemen - elemen yang akan menampilkan informasi buku di dalam list
function makeBook(bookObject){
    const {id, title, author, year, isCompleted} = bookObject;

    const titleText = document.createElement('h3');
    titleText.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Penulis : ${bookObject.author}`;
   
    const textYear = document.createElement('p');
    textYear.innerText = `Tahun : ${bookObject.year}`;
   
    const bookContainer = document.createElement('article');
    bookContainer.classList.add('book_item');
    bookContainer.append(titleText, textAuthor, textYear);
    bookContainer.setAttribute('id', `book-${bookObject.id}`);
    

    if (isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.innerText = 'Belum Selesai di Baca';
        undoButton.classList.add('green');
        undoButton.addEventListener('click', function () {
          undoBookFromCompleted(id);
        });
        
        const trashButton = document.createElement('button');
        trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
        trashButton.classList.add('red');
        trashButton.addEventListener('click', function () {
          Swal.fire({
            title: 'Hapus Buku?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Iya, hapus',
            cancelButtonText: 'Batal'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Dihapus!',
                'Buku berhasil di hapus.',
                'success'
              )
              removeBookFromCompleted(id);
            }
          })            
        });

        
    
        bookContainer.append(undoButton, trashButton);
    } else {
    
        const checkButton = document.createElement('button');
        checkButton.innerText = 'Selesai';
        checkButton.classList.add('green');
        checkButton.addEventListener('click', function () {
          addBookToCompleted(id);
        });

        const trashButton = document.createElement('button');
        trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
        trashButton.classList.add('red');
        trashButton.addEventListener('click', function () {
          Swal.fire({
            title: 'Hapus Buku?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Iya, hapus',
            cancelButtonText: 'Batal'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Dihapus!',
                'Buku berhasil di hapus.',
                'success'
              )
              removeBookFromCompleted(id);
            }
          })
        });
    
        bookContainer.append(checkButton, trashButton);
    }


    return bookContainer;
}


// Menambahkan buku ke dalam list yang sudah di baca
function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);
  
    if (bookTarget == null) return;
  
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(generateBookList));
    saveData();
}
  

//  Fungsi untuk menghapus buku dari list
function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
  
    if (bookTarget === -1) return;
  
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(generateBookList));
    saveData();
}


//  Fungsi untuk mengembalikan buku dari sudah di baca ke rak belum selesai di baca
function undoBookFromCompleted(bookId) {
 
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
  
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(generateBookList));
    saveData();
}


// Fungsi untuk mendapatkan nilai ketika form di submmit dan, 
// menjalankan fungsi untuk menambahkan buku baru
document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');

    submitForm.addEventListener('submit', function (event) {
        Swal.fire({
          title: 'Berhasil Menambahkan Buku',
          icon: 'success',
          confirmButtonText: 'Oke'
        });
        event.preventDefault();
        addBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(SAVED_EVENT, () => { 
    
});


// Costum event untuk menampilkan buku ke list
document.addEventListener(generateBookList, function () {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');
 
    incompleteBookshelfList.innerText = '';
    completeBookshelfList.innerText = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (bookItem.isCompleted) {
            completeBookshelfList.append(bookElement);
        }else {
            incompleteBookshelfList.append(bookElement);
        }
    }    
});
