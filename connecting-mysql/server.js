const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize("test", process.env.DB_USER, process.env.DB_PASS, {
  host: "localhost",
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

/*
 * El metodo sequelize.define() define un nuevo modelo
 * que representa una tabla en la base de datos
 *
 */
const Book = sequelize.define("books", {
  title: {
    type: Sequelize.DataTypes.STRING,
    /*
     * allowNull significa que el campo no puede ser "null"
     * cuando se envía a la base de datos.
     * Lanza un error si es "null".
     *
     * Se puede definir un valor por defecto usando: */
    // defaultValue: "valor",
    allowNull: false,
  },
  author: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  release_date: {
    type: Sequelize.DataTypes.DATEONLY,
  },
  subject: {
    type: Sequelize.DataTypes.INTEGER,
  },
});

sequelize
  .sync()
  /*
   * El metodo sync() ejecuta una consulta SQL a la base de datos
   * y crea la tabla
   */
  .then(() => {
    console.log("Book table created successfully");
  })
  .catch((error) => {
    console.log("Unable to create table : ", error);
  });

const createBook = async () => {
  const book = await Book.create({
    title: "Test",
    author: "test",
    release_date: "2022-12-14",
    subject: 3,
  });
  console.log(book);
};

const findAllBook = async () => {
  const books = await Book.findAll();
  console.log(books);
};

const findOneById = async (id) => {
  const book = await Book.findOne({
    where: {
      id: id,
    },
  });
  console.log(book);
};

const deleteBook = async (id) => {
  const book = await Book.destroy({
    where: {
      id: id,
    },
  });
  console.log(book);
};

const updateBook = async (id) => {
  const book = await Book.update(
    {
      title: "Test2",
      author: "test2",
    },
    {
      where: {
        id: id,
      },
    }
  );
  console.log(book);
};
