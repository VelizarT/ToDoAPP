$(document).ready(function () {

    $('#todos-edit-cnt').on('click', '.btn-edit', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $this = $(this);

        var currentTodoTextDiv = $this.parent().parent().parent().siblings('.edit-text');
        currentTodoTextDiv.attr('contenteditable', 'true');
        currentTodoTextDiv.focus();
    });

    $('#todos-edit-cnt').on('click', '.btn-save', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $this = $(this);
        
        var currentTodoId = $this.parent().parent().parent().siblings('.id-cnt').html();
        var currentTodoText = $this.parent().parent().parent().siblings('.edit-text').text();
        var isCompleted = ($this.parent().prev().children('input[type=checkbox]:checked').val()) === 'Yes';

        patchTodo(currentTodoId, currentTodoText, isCompleted).then(function (response) {
            location.reload();
        });
    });
});

var getTodoById = function(id) {
    var url = '/todos/' + id; 
    return $.ajax({
        url: url,
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        beforeSend: function (request) {
            request.setRequestHeader('x-auth', token)
        }
    });
}

var todoEditMode = function(todo) {
    var todosEditCnt = $('#todos-edit-cnt');

    //create container
    var editCnt = $('<div></div>').addClass('edit-cnt');
    var todoTitle = $('<h3></h3>').html(todo.title).addClass('edit-title');
    var todoText = $('<div></div>').html(todo.text).addClass('edit-text');    
    var todoId = $('<span></span>').html(todo._id).addClass('hidden id-cnt');    

    if(!todo.completed) {
    
        //create form
        var todoForm = $('<form></form>').addClass('todo-style');
        var editButton = $('<button>Edit</button>').addClass('btn btn-edit');
        var saveButton = $('<button>Save</button>').addClass('btn btn-save');
        var buttonsCnt = $('<div class="btn-cnt"></div>').append(editButton).append(saveButton);
        var label = $('<label class="form-check-label">Check to complete:</label>');
        var checkbox = $('<input class="form-check-input" type="checkbox" name="isCompleted" value="Yes"/>').prop('checked', false);
        var checkboxCnt = $('<div class="form-check-inline checkbox-cnt"></div>').append(label).append(checkbox);
        var todoSideBar = $('<div></div>').addClass('side-bar');
        todoSideBar.append(checkboxCnt).append(buttonsCnt);
        todoForm.append('<hr>').append(todoSideBar);

        editCnt.append(todoTitle).append('<hr>').append(todoText).append(todoId).append(todoForm);

    } else {
        //create completedAtCnt
        var completedText = $('<span></span>').html('Completed:  ');
        var calendar = $('<span></span>').addClass('far fa-calendar-alt');
        var clock = $('<span></span>').addClass('far fa-clock');
        var completedAtDateTime = new Date(todo.completedAt);
        var completedAtDate = ' ' + completedAtDateTime.getDate() + '/' + (completedAtDateTime.getMonth() + 1) + '/' + completedAtDateTime.getFullYear();
        var completedAtTime = ' ' + completedAtDateTime.getHours() + ':'+ completedAtDateTime.getMinutes() + ':' + completedAtDateTime.getSeconds();
        var completedDateTimeCnt = $('<div></div>').addClass('date-time-completed');
        calendar.text(completedAtDate);
        clock.text(completedAtTime);
        completedDateTimeCnt.append(completedText).append(calendar).append(' '). append(clock);
        
        editCnt.append(todoTitle).append('<hr>').append(todoText).append(todoId).append('<hr>').append(completedDateTimeCnt);    
    }

    //append all
    todosEditCnt.append(editCnt);
}

