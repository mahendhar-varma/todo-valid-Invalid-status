const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const path = require("path");
const dateFns = require("date-fns");
const isValid = require("date-fns/isValid");

const app = express();
app.use(express.json());
module.exports = app;

const dbPath = path.join(__dirname, "todoApplication.db");

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3009, () => {
      console.log("Server running at http://localhost:3009 successfully");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const validStatusCheckFunction = (request, response, next) => {
  const statusArray = ["TO DO", "IN PROGRESS", "DONE"];
  const requestQuery = request.query;
  const requestBody = request.body;

  if (requestQuery.status === undefined && requestBody.status === undefined) {
    next();
  } else {
    if (requestQuery.status !== undefined && requestBody.status !== undefined) {
      if (
        statusArray.includes(requestQuery.status) &&
        statusArray.includes(requestBody.status)
      ) {
        next();
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }
    } else {
      if (requestQuery.status !== undefined) {
        if (statusArray.includes(requestQuery.status)) {
          next();
        } else {
          response.status(400);
          response.send("Invalid Todo Status");
        }
      } else {
        if (requestBody.status !== undefined) {
          if (statusArray.includes(requestBody.status)) {
            next();
          } else {
            response.status(400);
            response.send("Invalid Todo Status");
          }
        }
      }
    }
  }
};

const validPriorityCheckFunction = (request, response, next) => {
  const priorityArray = ["HIGH", "MEDIUM", "LOW"];
  const requestQuery = request.query;
  const requestBody = request.body;

  if (
    requestQuery.priority === undefined &&
    requestBody.priority === undefined
  ) {
    next();
  } else {
    if (
      requestQuery.priority !== undefined &&
      requestBody.priority !== undefined
    ) {
      if (
        priorityArray.includes(requestQuery.priority) &&
        priorityArray.includes(requestBody.priority)
      ) {
        next();
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }
    } else {
      if (requestQuery.priority !== undefined) {
        if (priorityArray.includes(requestQuery.priority)) {
          next();
        } else {
          response.status(400);
          response.send("Invalid Todo Priority");
        }
      } else {
        if (requestBody.priority !== undefined) {
          if (priorityArray.includes(requestBody.priority)) {
            next();
          } else {
            response.status(400);
            response.send("Invalid Todo Priority");
          }
        }
      }
    }
  }
};

const validCategoryCheckFunction = (request, response, next) => {
  const categoryArray = ["WORK", "HOME", "LEARNING"];
  const requestQuery = request.query;
  const requestBody = request.body;

  if (
    requestQuery.category === undefined &&
    requestBody.category === undefined
  ) {
    next();
  } else {
    if (
      requestQuery.category !== undefined &&
      requestBody.category !== undefined
    ) {
      if (
        categoryArray.includes(requestQuery.category) &&
        categoryArray.includes(requestBody.category)
      ) {
        next();
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
    } else {
      if (requestQuery.category !== undefined) {
        if (categoryArray.includes(requestQuery.category)) {
          next();
        } else {
          response.status(400);
          response.send("Invalid Todo Category");
        }
      } else {
        if (requestBody.category !== undefined) {
          if (categoryArray.includes(requestBody.category)) {
            next();
          } else {
            response.status(400);
            response.send("Invalid Todo Category");
          }
        }
      }
    }
  }
};

const validDateCheck = (request, response, next) => {
  const requestBody = request.body;
  const requestQuery = request.query;

  const requestBodyDate = requestBody.dueDate;
  const requestQueryDate = requestQuery.date;

  if (requestBody.dueDate === undefined && requestQuery.date === undefined) {
    next();
  } else {
    let bodyDateCheck;
    let queryDateCheck;
    if (requestBody.dueDate !== undefined && requestQuery.date !== undefined) {
      bodyDateCheck = isValid(new Date(requestBodyDate));
      queryDateCheck = isValid(new Date(requestQueryDate));
      if (bodyDateCheck === true && queryDateCheck === true) {
        next();
      } else {
        response.status(400);
        response.send("Invalid Due Date");
      }
    } else {
      if (requestBody.dueDate !== undefined) {
        bodyDateCheck = isValid(new Date(requestBodyDate));
        if (bodyDateCheck === true) {
          next();
        } else {
          response.status(400);
          response.send("Invalid Due Date");
        }
      } else {
        if (requestQuery.date !== undefined) {
          queryDateCheck = isValid(new Date(requestQueryDate));
          if (queryDateCheck === true) {
            next();
          } else {
            response.status(400);
            response.send("Invalid Due Date");
          }
        }
      }
    }
  }
};

const hasStatusProperty = (requestQuery) => {
  return requestQuery.status !== undefined;
};
const hasPriorityProperty = (requestQuery) => {
  return requestQuery.priority !== undefined;
};
const hasStatusAndPriorityProperty = (requestQuery) => {
  return (
    requestQuery.status !== undefined && requestQuery.priority !== undefined
  );
};

const hasStatusAndCategoryProperty = (requestQuery) => {
  return (
    requestQuery.status !== undefined && requestQuery.category !== undefined
  );
};

const hasCategoryProperty = (requestQuery) => {
  return requestQuery.category !== undefined;
};

const hasPriorityAndCategoryProperty = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.category !== undefined
  );
};

//API 1
app.get(
  "/todos/",
  validStatusCheckFunction,
  validPriorityCheckFunction,
  validCategoryCheckFunction,
  async (request, response) => {
    const { search_q = "", status, priority, category } = request.query;

    let getTodoQuery;
    switch (true) {
      case hasStatusProperty(request.query):
        getTodoQuery = `
        SELECT * 
        FROM todo 
        WHERE status LIKE '${status}'
        AND todo LIKE '%${search_q}%'`;
        break;
      case hasPriorityProperty(request.query):
        getTodoQuery = `
        SELECT * 
        FROM todo 
        WHERE priority LIKE '${priority}'
        AND todo LIKE '%${search_q}%'`;
        break;
      case hasStatusAndPriorityProperty(request.query):
        getTodoQuery = `
        SELECT * 
        FROM todo 
        WHERE status LIKE '${status}'
        AND priority LIKE '${priority}'
        AND todo LIKE '%${search_q}%'`;
        break;
      case hasStatusAndCategoryProperty(request.query):
        getTodoQuery = `
        SELECT * 
        FROM todo 
        WHERE status LIKE '${status}'
        AND category LIKE '${category}'
        AND todo LIKE '%${search_q}%'`;
        break;
      case hasPriorityAndCategoryProperty(request.query):
        getTodoQuery = `
        SELECT * 
        FROM todo 
        WHERE priority LIKE '${priority}'
        AND category LIKE '${category}'
        AND todo LIKE '%${search_q}%'`;
        break;
      case hasCategoryProperty(request.query):
        getTodoQuery = `
        SELECT * 
        FROM todo 
        WHERE category LIKE '${category}'
        AND todo LIKE '%${search_q}%'`;
        break;
      default:
        getTodoQuery = `
        SELECT * FROM todo WHERE todo LIKE '%${search_q}%'`;
        break;
    }
    const todoResponse = await db.all(getTodoQuery);
    response.send(
      todoResponse.map((eachTodo) => {
        return {
          id: eachTodo["id"],
          todo: eachTodo["todo"],
          priority: eachTodo["priority"],
          status: eachTodo["status"],
          category: eachTodo["category"],
          dueDate: eachTodo["due_date"],
        };
      })
    );
  }
);

//API 2
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodoOnIdQuery = `SELECT * FROM todo WHERE id = '${todoId}';`;
  const todo = await db.get(getTodoOnIdQuery);
  response.send({
    id: todo["id"],
    todo: todo["todo"],
    priority: todo["priority"],
    status: todo["status"],
    category: todo["category"],
    dueDate: todo["due_date"],
  });
});

//API 3
app.get("/agenda/", validDateCheck, async (request, response) => {
  const { date } = request.query;
  const formatDate = dateFns.format(new Date(date), "yyy-MM-dd");
  const getTodoOnDateQuery = `
  SELECT * 
  FROM todo 
  WHERE due_date = '${formatDate}';`;
  const todoWithSpecificDate = await db.all(getTodoOnDateQuery);
  response.send(
    todoWithSpecificDate.map((eachTodo) => {
      return {
        id: eachTodo["id"],
        todo: eachTodo["todo"],
        priority: eachTodo["priority"],
        status: eachTodo["status"],
        category: eachTodo["category"],
        dueDate: eachTodo["due_date"],
      };
    })
  );
});

//API 4
app.post(
  "/todos/",
  validStatusCheckFunction,
  validPriorityCheckFunction,
  validCategoryCheckFunction,
  validDateCheck,
  async (request, response) => {
    const { todo, priority, status, category, dueDate } = request.body;
    const formatDate = dateFns.format(new Date(dueDate), "yyy-MM-dd");
    const postQuery = `
    INSERT INTO todo (todo, priority, status, category, due_date) 
    VALUES(
        '${todo}',
        '${priority}',
        '${status}',
        '${category}',
        '${formatDate}'
    )`;

    await db.run(postQuery);
    response.send("Todo Successfully Added");
  }
);

//API 5
app.put(
  "/todos/:todoId/",
  validStatusCheckFunction,
  validPriorityCheckFunction,
  validCategoryCheckFunction,
  validDateCheck,
  async (request, response) => {
    const { todoId } = request.params;
    const requestBody = request.body;
    let responseText = "";
    switch (true) {
      case requestBody.status !== undefined:
        responseText = "Status Updated";
        break;
      case requestBody.priority !== undefined:
        responseText = "Priority Updated";
        break;
      case requestBody.category !== undefined:
        responseText = "Category Updated";
        break;
      case requestBody.dueDate !== undefined:
        responseText = "Due Date Updated";
        break;
      case requestBody.todo !== undefined:
        responseText = "Todo Updated";
        break;
      default:
        break;
    }
    const previousTodoQuery = `
  SELECT * 
  FROM todo 
  WHERE id = '${todoId}'`;

    const previousTodo = await db.get(previousTodoQuery);

    const {
      todo = previousTodo.todo,
      priority = previousTodo.priority,
      status = previousTodo.status,
      category = previousTodo.category,
      dueDate = previousTodo.due_date,
    } = request.body;

    const updateTodoQuery = `
  UPDATE 
      todo
  SET 
     todo = '${todo}',
     priority = '${priority}',
      status = '${status}',
      category = '${category}',
      due_date = '${dueDate}'
  WHERE 
        id = '${todoId}'`;
    await db.run(updateTodoQuery);
    response.send(responseText);
  }
);

//API 6
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteQuery = `DELETE FROM todo WHERE id = '${todoId}'`;
  await db.run(deleteQuery);
  response.send("Todo Deleted");
});
