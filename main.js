
const PRIORITY = Object.freeze({
    LOW: { name: "Low" },
    HIGH: { name: "High" },
    URGENT: { name: "Urgent" },
})

class ListElement {
    constructor(title, description, dueDate, priority, checklist=null) {
        this.title = title
        this.description = description
        this.dueDate = dueDate
        this.priority = priority
        this.checklist = checklist
    }
}


class List {
    constructor() {
        this.todos = []
    }

    addElementToList(newElement) {
        this.todos.push(newElement)
    }

    filterByDate(date)
    {
        let filtered = [];
        this.todos.forEach((elem) => {
            let now = new Date();
            now.setTime(Date.now());
            now.setHours(0, 0, 0, 0);
            if(elem.dueDate <= date && elem.dueDate >= now) {
                filtered.push(elem);
            }
        })

        return filtered;
    }
}

class RenderCanvas {
    constructor() {
        this.rendered = false;
        this.listContainer = document.querySelector(".list-display");
        this.renderingEngine = new RenderingEngine();
    }

    renderList(list) {
        this.listContainer.innerHTML = "";
        list.forEach((elem) => {
            this.listContainer.appendChild(this.renderingEngine.getListElementObject(elem))
        });
    }
    
}

function getFutureDate(days) {
    let a = new Date();
    a.setTime(Date.now());
    a.setDate(a.getDate() + days);
    return a;
}

class RenderingEngine {
    getListElementObject(element) {
        let newElementDiv = document.createElement("div");
        newElementDiv.classList.add("list-element");
        newElementDiv.innerHTML = `
            <div class="initial">
                <div class="title">${element.title}</div>
                <div class="dropdown"><input type="checkbox" name="complete-1" id=""></div>
                <div class="other-info">
                    <div class="due-date">${element.dueDate.toDateString()}</div>
                    <div class="priority">${element.priority.name}</div>
                </div>
            </div>`;
            
        let expanded = false;
        let expansionFunc = (event) => {
            if(expanded) {
                expanded = false;
                newElementDiv.innerHTML = `
                <div class="initial">
                    <div class="title">${element.title}</div>
                    <div class="dropdown"><input type="checkbox" name="complete-1" id=""></div>
                    <div class="other-info">
                        <div class="due-date">${element.dueDate.toDateString()}</div>
                        <div class="priority">${element.priority.name}</div>
                    </div>
                </div>
                `
            }
            else {
                expanded = true;
                newElementDiv.innerHTML = `
                <div class="initial">
                    <div class="title">${element.title}</div>
                    <div class="dropdown"><input type="checkbox" name="complete-1" id=""></div>
                    <div class="other-info">
                        <div class="due-date">${element.dueDate.toDateString()}</div>
                        <div class="priority">${element.priority.name}</div>
                    </div>
                </div>
                <div class="expansion">
                    <div class="desc-heading">
                        Description
                    </div>
                    <div class="description">
                        ${element.description}
                    </div>
                </div>
                `
            }
        }

        const checkbox = newElementDiv.querySelector(".dropdown");

        newElementDiv.addEventListener("mouseup", expansionFunc);
        return(newElementDiv);
    }
}

const todayButton = document.querySelector("#today");
const thisWeekButton = document.querySelector("#this-week");
const allButton = document.querySelector("#all");


let element1 = new ListElement("New Element", "This is a good day", new Date("2024-6-20"), PRIORITY.LOW)
let element2 = new ListElement("New Element 1", "This is supposed to be a bad day", new Date("2024-7-10"), PRIORITY.HIGH)
let list = new List();
list.addElementToList(element1);
list.addElementToList(element2);

let renderCanvas = new RenderCanvas();

todayButton.addEventListener("click", (event) => {
    renderCanvas.renderList(list.filterByDate(getFutureDate(1)));
});

thisWeekButton.addEventListener("click", (event) => {
    renderCanvas.renderList(list.filterByDate(getFutureDate(6)));
});

allButton.addEventListener("click", (event) => {
    renderCanvas.renderList(list.filterByDate(getFutureDate(1000)));
})

document.addEventListener("DOMContentLoaded", function() {
    var dialog = document.getElementById("myDialog");
    var openBtn = document.querySelector(".add-new");
    var closeBtn = document.getElementById("closeDialogBtn");
    var form = document.getElementById("dialog-form");

    
    openBtn.onclick = function() {
        dialog.showModal();
    };

    closeBtn.onclick = function(input) {
        const title = form.elements["title-input"].value;
        const desc = form.elements["desc-input"].value;
        const dueDate = new Date(form.elements["date-input"].value);
        const priority = form.querySelector('input[name="priority"]:checked');
        let prioValue;
        switch(priority.id)
        {
            case "prio-high":
            prioValue = PRIORITY.URGENT;
            break;
            case "prio-medium":
            prioValue = PRIORITY.HIGH;
            break;
            case "prio-low":
            prioValue = PRIORITY.LOW;
        }

        console.log(dueDate);

        let newEle = new ListElement(title, desc, dueDate, prioValue);
        list.addElementToList(newEle);
        dialog.close();
    };

    dialog.addEventListener('click', function(event) {
        if (event.target === dialog) {
            dialog.close();
        }
    });
});

renderCanvas.renderList(list.filterByDate(getFutureDate(1000)));

