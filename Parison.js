/* Author Neo */


/// menuitems with initial datas
/// treating array like Database
let menuItems = [
  { 
    id: 1,
    name: "Latte",
    category: "Coffee", 
    price: 75, 
    stock: 12, 
    image : "imgs/hotcoffee.jpg"
  },
  {
     id: 2, 
     name: "Americano",
     category: "Coffee", 
     price: 60, 
     stock: 10, 
     image: "imgs/americano.jpg"
    },

  { id: 3,
    name: "Green Tea Latte",
    category: "Tea",
    price: 70,
    stock: 8,
    image: "imgs/tea.jpg" 
   },

  { 
    id: 4, 
    name: "Thai Tea", 
    category: "Tea", 
    price: 65, 
    stock: 15, 
    image: "imgs/thaitea.jpg"
},
  { id: 5, 
    name: "Chocolate Cake",
    category: "Cake",
    price: 90,
    stock: 5,
    image: "imgs/cake.jpg" 
},
{ 
    id: 6, 
    name: "Cheesecake",
    category: "Cake", 
    price: 95, 
    stock: 6, 
    image: "imgs/cake2.jpg" 
},

{ 
    id: 7,
    name: "Croissant",
    category: "Food",
    price: 55,
    stock: 15,
    image: "imgs/food.jpg"
},
  { 
    id: 8, 
    name: "Brownie", 
    category: "Cake", 
    price: 70, 
    stock: 7, 
    image: "imgs/cake3.jpg"
}
];

let orders = [
  {
    id: 1005,
    items: [{ itemId: 1, name: "Latte", price: 75, quantity: 2 },
            { itemId: 5, name: "Chocolate Cake", price: 90, quantity: 1 }],
    total: 240,
    status: "Pending",
    time: "14:32"
  },
  {
    id: 1004,
    items: [{ itemId: 4, name: "Thai Tea", price: 65, quantity: 1 }],
    total: 65,
    status: "Pending",
    time: "13:20"
  },
  {
    id: 1003,
    items: [{ itemId: 2, name: "Americano", price: 80, quantity: 1 }],
    total: 80,
    status: "Completed",
    time: "12:15"
  },
  {
    id: 1002,
    items: [{ itemId: 1, name: "Latte", price: 75, quantity: 1 },
            { itemId: 5, name: "Chocolate Cake", price: 90, quantity: 1 }],
    total: 165,
    status: "Completed",
    time: "11:45"
  },
  {
    id: 1001,
    items: [{ itemId: 3, name: "Green Tea Latte", price: 70, quantity: 1 }],
    total: 70,
    status: "Completed",
    time: "10:30"
  }
];

let nextItemId = 9;
let nextOrderId = 1006;
let deletedItemId = null;
let editItemId = null;

let cafeSettings = {
    cafeName: "Parision Café",
    adminName: "Neo&Erick"
}

const grid = document.querySelector(".view-menu .grid")
// formats prices to Thai bhat format with two decimal place
const formatMoney = (amount) => {
    return "฿" + Number(amount).toFixed(2); // meaning two decimal places double values
}


// find item by its id
const findItem = (id) => {
    return menuItems.find(item => item.id === Number(id))
}

// find order by its id
const findOrder = (id) => {
    return orders.find(order => order.id === Number(id))
}

// render menu display menu items with cards
const renderMenus = (items = menuItems) => {

    if(!grid){
        /// unexpected error here. check HTML selector
        console.warn("Menu grid not found!")
        return;
    }

    if(items.length === 0){
        grid.innerHTML = "<p style='color: red; font-size: 1.5rem;'>No items found!</p>";
        return;
    }

    grid.innerHTML = items.map((item) => {
     return `
        <article class="card ${item.category.toLowerCase()}">
              <div class="pic">
                  <img src="${item.image}" 
                       alt = "${item.name}"
                    onerror="this.style.display='none'">
              </div>
                <h3>${item.name}</h3>
                <p class="muted">${item.category}</p>
                <p class="price">${formatMoney(item.price)}</p>
                <p class="muted">Stock: ${item.stock}</p>
                <div class="row">
                  <a class="btn small edit-item" type = "button" href="#add-item"
                  data-id="${item.id}">Edit</a>
                  <a class="btn small delete-item" type ="button" href="#delete"
                  data-id="${item.id}">Delete</a>
                </div>
        </article>

        `
    }
    ).join("")
}

grid.addEventListener("click", (event) => {
    /// get closet taget "a" element
    /// get child element
    const button = event.target.closest("a");

    /// if not found, return nothing;
    if (!button) return;

    /// button.dataset.id return data-id of item id above html
    const id = Number(button.dataset.id);
    if (button.classList.contains("edit-item")) {

        /// as long as we click edit, the form will show current items
        showItemsToEdit(id)
    }

    if (button.classList.contains("delete-item")) {
        handleDeleteItem(id)
    }
});

/// when user click edit btn, this action will show live item datas check before actually editing them
const showItemsToEdit = (id) => {
       
    /// get current item we want to edit by its id
        const item = findItem(id);

        if(!item){
            console.warn(`Item with id ${id} is not found!`)
            showErrorMessage(`Item with id ${id} is not found!`)
            return;
        }

        editItemId = id;
        document.querySelector("#fName").value = item.name;
        document.querySelector("#fPrice").value = item.price;
        document.querySelector("#fCat").value = item.category;
        document.querySelector("#fStock").value = item.stock;

        document.querySelector("#addTitle").textContent = "Edit item";
}

const handleDeleteItem = (id) => {
        deletedItemId = id;

        const item = findItem(id);

        if(!item){
            console.warn(`Item with id ${id} is not found!`)
            showErrorMessage(`Item with id ${id} is not found!`)
            return;
        }
        
        /// show what item we want to delete in modal title
        document.querySelector("#delTitle").textContent =
            `Delete ${item.name}?`;
}

/// actual delete logic happen here
const deleteConfirm = document.querySelector("#delete .btn.danger");
deleteConfirm.addEventListener("click", (event) => {
    event.preventDefault();

    if (deletedItemId === null) {
        return;
    }

    const itemToDelete = findItem(deletedItemId)

    if(!itemToDelete){
        return;
    }
    /// items delete logic
    menuItems = menuItems.filter(item => item.id !== deletedItemId);

    // display remaining items
    console.log(menuItems);

    renderMenus();
    renderOrderOptions()
    showSuccessMessage(`${itemToDelete.name} is deleted successfully!`)

    deletedItemId = null;
    location.hash = "v-menu";
});


const itemForm = document.querySelector("#add-item form");

itemForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const isSaved = saveItems()

    if(!isSaved){
        return;
    }

    resetItemForm();
    location.hash = "v-menu";
});


const saveItems = () => {
    const name = document.querySelector("#fName").value.trim();
    const price = Number(document.querySelector("#fPrice").value);
    const category = document.querySelector("#fCat").value;
    const stock = Number(document.querySelector("#fStock").value);

    if(!validateItems(name,price,category,stock)){
        return false;
    }

    if(editItemId != null){
        editItem(name,price,category,stock)
        editItemId = null
    }
    else{
        addItem(name,price,category,stock)
    }
    return true;
}

const editItem = (name,price,category,stock) => {
        const item = findItem(editItemId);

        /// this logic will place existing items we select based on editItemId in form
        if (item) {
            item.name = name;
            item.price = price;
            item.category = category;
            item.stock = stock;
        }
        renderMenus()
        renderOrderOptions() /// this method should be called here again because whenever we edit an item in menu, we need to update that item in order option
        showSuccessMessage(`${item.name} is edited successfully!`)
}

const addItem = (name,price,category,stock) => {

        // as we don't have a highly coherent database to store images
        // we use default images that is already stored in img folder of project

    // this img object refer img file from folder with key => Category
    const images = {
        Coffee: "imgs/latte.jpg",
        Coffee: "imgs/hotcoffee.jpg",
        Coffee: "imgs/americano.jpg",
        Tea: "imgs/tea.jpg",
        Tea: "imgs/thaitea.jpg",
        Cake: "imgs/cake.jpg",
        Cake : "imgs/cake2.jpg",
        Cake : "imgs/cake3.jpg",
        Food: "imgs/food.jpg"
    };

    const newItem = {
            id: nextItemId++,
            name: name,
            category: category,
            price: price,
            stock: stock,
            image: images[category]
        }

        menuItems.push(newItem);
        console.log(menuItems); // all menus after adding one

        renderMenus()
        renderOrderOptions() /// this method should be called here again because whenever we add new item in menu, we need to update that item in order option
        showSuccessMessage(`${name} is added successfully!`)
}

/// manual validation handling

const validateItems = (name,price,category,stock) => {

    clearFormError() /// this recall is important cuz after form is validated again, we want to clear previous error when we open form again
    const validCategories = ["Coffee", "Tea", "Cake", "Food"];

    if(name.length < 7){
        showFormError("Name must be greater than 7")
        return false;
    }

    if (!Number.isFinite(price) || price <= 0 || !Number.isInteger(price)) {
        showFormError("Price must be a positive whole number!");
        return false;
    }

    if(!validCategories.includes(category)){
        showFormError("Please select a valid category!");
        return;
    }
    if (!Number.isInteger(stock) || stock <= 0) {
        showFormError("Stock must be greater than 0!");
        return false;
    }

    return true;
}

const showFormError = (msg) => {
    const formError = document.querySelector("#formError")
    formError.textContent = msg
    formError.hidden = false;
}

const clearFormError = () => {
    const formError = document.querySelector("#formError")
    formError.textContent = ""
    formError.hidden = true;
}


const addItemBtn = document.querySelector("#addItemBtn");

addItemBtn.addEventListener("click", () => {
    resetItemForm();
});


// when clicking cancel btn of item, reset form
const cancelItemBtn = document.querySelector("#cancelBtn");

cancelItemBtn.addEventListener("click", () => {
    resetItemForm();
});

const resetItemForm = () => {
    editItemId = null;

    itemForm.reset();

    document.querySelector("#addTitle").textContent = "Add item";
}

/// render method for all order data
const renderOrders = () => {

    const orderTableBody = document.querySelector(".view-orders table tbody")
    if (!orderTableBody) {
        console.warn("Orders table not found!");
        return;
    }

    orderTableBody.innerHTML = orders.map(order => {

        const itemNames = order.items.map(item => `${item.name} x ${item.quantity}`).join(",")

        const statusClass = order.status === "Pending" ? "pending" : "done"

        // this ensures pending orders have both Complete and Delete Btn while complete orders have only delete btn
        const action = 
            `${order.status === "Pending" 
                    ?
                  `<a class="btn small good complete-order" href="#" data-id= ${order.id}>Complete</a>`             
                    :
                    `<a class="btn small view" href="#">View</a>`
                   }
                   <a class="btn small danger delete-order"
                     href="#" data-id="${order.id}">Delete</a>

            `
                
    return `
           <tr>
                <td><strong>#${order.id}</strong></td>
                <td>${itemNames}</td>
                <td>${formatMoney(order.total)}</td>
                <td>
                    <span class="badge ${statusClass}">
                        ${order.status}
                    </span>
                </td>
                <td>${order.time}</td>
                <td>${action}</td>
            </tr>
        `
    }).join("")


    /// to monitor number of items, pending, and completed items
   const statas = document.querySelectorAll(".view-orders .stats .stat strong")

    if(statas.length >= 3){
        const pendingOrders = orders.filter(order => order.status === "Pending")
        const completedOrders = orders.filter(order => order.status === "Completed")
        statas[0].textContent = orders.length
        statas[1].textContent = pendingOrders.length
        statas[2].textContent = completedOrders.length
    }

}


const renderOrderOptions = () => {
    const select = document.querySelector("#oItem");

    if (!select) {
        console.warn("Order item selector not found!");
        return;
    }

    ///item.id in option value is important cuz it let us find correct menu item by id 
    select.innerHTML = menuItems.map((item) => {
        return `
        <option value = "${item.id}" ${item.stock === 0 ? "disabled" : ""}>
            ${item.name} - ${formatMoney(item.price)}
            (Stock: ${item.stock})
        </option>
        `
    }).join("")
}


/// complete order action

 const orderTableBody = document.querySelector(".view-orders table tbody")

orderTableBody.addEventListener("click", (e) => {
   /// select child complete-order button element from table body 
   const button = e.target.closest("a")

   if(!button){
    return;
   }

   e.preventDefault()
   const id = Number(button.dataset.id)

   /// if child, button has class containing complete-order, call completeOrder function
   if(button.classList.contains("complete-order")){
    completeOrder(id)
   }
   // else call delete 
   if(button.classList.contains("delete-order")){
        const confirmed = confirm(
            `Are you sure you want to delete order #${id}?`
        );
            if(confirmed){
                deleteOrder(id);
            }
        }
   }
)

/// del order by id
const deleteOrder = (orderId) => {
    const order = findOrder(orderId)

    if(!order){
        console.warn(`Order with ${orderId} is not found!`);
    }

    orders = orders.filter(order => order.id !== orderId);
    renderOrders()
    showSuccessMessage(`order is deleted successfully!`)
}

// find first by id, and then set status to completed
const completeOrder = (id) => {
    const order = findOrder(id)

    if(!order){
        console.warn(`Order with ${id} is not found`)
    }

    if(order.status === "Completed"){
        return;
    }

    order.status = "Completed"

    /// display back all orders 
    renderOrders()
}

const orderForm = document.querySelector("#new-order form")

/// submit form for creating new order with itemName, quantity
orderForm.addEventListener("submit", (e) => {
    e.preventDefault()

    /// itemId inside order form that we get when we select #oItem
    const itemId = Number(document.querySelector("#oItem").value) 

    const quantity = Number(document.querySelector("#oQty").value);

    let success = createOrder(itemId, quantity)

    if(success){
        orderForm.reset()
        location.hash = "v-orders"
    }
})

const createOrder = (itemId, quantity) => {

    const item = findItem(itemId)

    /// validation handlings

    if(!item){
        showErrorMessage("Please select a valid menu item.")
        return false;
    }

    // if quantity is less than 1 or input quantity is not integer number
    if(quantity < 1 || !Number.isInteger(quantity)){
        showErrorMessage("Please select a valid menu item.")
        return false;
    }

    /// if input quantiy is greater than available stock
    if(item.stock < quantity){
        showErrorMessage(`Only ${item.stock} units of ${item.name} are available.`)
        return false;
    }

    item.stock -= quantity; /// this means, after we create new order with available stock, we need to decrease stock amount in menuitems
    const newOrder = {
            id: nextOrderId++,
            items: [{itemId: item.id , name: item.name, price : item.price, quantity: quantity}],
                total: item.price * quantity ,
                status: "Pending",
                /// convert current date time to string format
                time: new Date().toLocaleString("en-GB", {
                    hour : "2-digit",
                    minute: "2-digit"
                })
    }

    orders.push(newOrder)

    console.log(orders); // debugging all orders

    /// display all menus, orders and orderoptions back again
    renderMenus()
    renderOrders()
    renderOrderOptions()
    showSuccessMessage(`New order is added successfully!`)
    return true;
}


let toastTimer;
/// this method respond to user after user do any action
const showMessage = (message, msgType) => {
    const toast = document.querySelector("#toast")
    const toastMsg = document.querySelector("#toastMessage")
    const toastIcon = document.querySelector(".toast-icon")

    if(!toast || !toastMsg){
        return;
    }

    // set message here
    toastMsg.textContent = message

    toast.style.backgroundColor = msgType === "success" ? "#16a34a" : "#dc2626";
    if(msgType === "error"){
    toastIcon.style.display = "none"
    toast.style.borderColor = "#dc2626"
    toast.style.color = "#fff"
    }

    // some styling in css
    toast.classList.add("show")

    // reset timer of another msg appears
    clearTimeout(toastTimer)

    // msg dissapear after 3 second
    setTimeout(() => {
        toast.classList.remove("show")
    }, 3000)
}

// for success feedback
const showSuccessMessage = (message) => {
    showMessage(message, "success")
}

// for error feedback
const showErrorMessage = (message) => {
    showMessage(message, "error")
}

// simple setting form handling
const settingForm = document.querySelector(".view .settings-form")

settingForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const cafeName = document.querySelector("#cafeName").value.trim()
    const adminName = document.querySelector("#adminName").value.trim()
    const people = document.querySelector(".top .admin strong")

    people.textContent = adminName
    cafeSettings.cafeName = cafeName
    cafeSettings.adminName = adminName
    showSuccessMessage("Settings saved successfully!");
})

renderMenus()
renderOrders()
renderOrderOptions() /// display only available menu items in order options