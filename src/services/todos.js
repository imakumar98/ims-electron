import Database from 'db'


const syncTodos = async () => { 

    //Get local todos
    const todos = await Database.all("SELECT * FROM todos");

    console.log(todos);

}

syncTodos();