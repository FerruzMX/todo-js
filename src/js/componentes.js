import { Todo } from "../classes";
import { todoList } from '../index';


//Referencias en el HTML
const divTodoList = document.querySelector('.todo-list');
const txtInput = document.querySelector('.new-todo');
const btnBorrar = document.querySelector('.clear-completed');
const ulFiltros = document.querySelector('.filters');
const anchorFiltros = document.querySelectorAll('.filtro');
const todoPendientes = document.querySelector('.todo-count-pend');

export const crearTodoHtml = (todo) => {

    const htmlTodo = `
    <li class="${(todo.completado) ? 'completed' : ''}" data-id="${todo.id}">
        <div class="view">
           <input class="toggle" type="checkbox" ${(todo.completado) ? 'checked' : ''} >
           <label>${todo.tarea}</label>
           <button class="destroy"></button>
         </div>
        <input class="edit" value="Create a TodoMVC template">
    </li>`;

    const div = document.createElement('div');
    div.innerHTML = htmlTodo;
    divTodoList.append(div.firstElementChild);
    contarPendientes();

    return div.firstElementChild;

}




//Eventos

txtInput.addEventListener('keyup', (event) => {

    if (event.keyCode === 13 && txtInput.value.length > 0) {

        const nuevoTodo = new Todo(txtInput.value);
        todoList.nuevoTodo(nuevoTodo);
        crearTodoHtml(nuevoTodo);
        txtInput.value = '';

    }

});


divTodoList.addEventListener('click', (event) => {

    const nombreElemenento = event.target.localName; //label, input, button
    const todoElemento = event.target.parentElement.parentElement;
    const todoId = todoElemento.getAttribute('data-id');

    if (nombreElemenento.includes('input')) { //click en el check
        todoList.marcarCompletado(todoId);
        todoElemento.classList.toggle('completed');
    }
    else if (nombreElemenento.includes('button')) { //hay que borrar el todo
        todoList.eliminarTodo(todoId);

        divTodoList.removeChild(todoElemento);
    }

   contarPendientes();

});


btnBorrar.addEventListener('click', () => {

    todoList.eliminarCompletados();

    for (let i = divTodoList.children.length - 1; i >= 0; i--) {

        const elemento = divTodoList.children[i];

        if (elemento.classList.contains('completed')) {
            divTodoList.removeChild(elemento);
        }

    }
    
    contarPendientes();
});


ulFiltros.addEventListener('click', (event) => {

    const filtro = event.target.text;

    if (!filtro) { return; }
    
    let countPendientes = 0;

    anchorFiltros.forEach(elem => elem.classList.remove('selected'));

    event.target.classList.add('selected');

    for (const elemento of divTodoList.children) {

        elemento.classList.remove('hidden');
        const completado = elemento.classList.contains('completed');
        contarPendientes();

        switch (filtro) {
            case 'Pendientes':
                if (completado) {
                    elemento.classList.add('hidden');
                    contarPendientes();
                }
                break;

            case 'Completados':
                if (!completado) {
                    elemento.classList.add('hidden');
                    todoPendientes.innerHTML = '0';
                }
                break;
        }

       
    }


});

function contarPendientes(){
   
   let count = 0;
   
   for(const elemento of divTodoList.children){
    
     
      
      if(elemento.classList.contains('completed')){
        continue;
      }   
     
      count++;
     
    
   } 

   todoPendientes.innerHTML = count;
}