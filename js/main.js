                            ' use strict ';

document.addEventListener('DOMContentLoaded', () => {

    // Объявленные переменные.
    const customer = document.getElementById('customer'),
          freelancer = document.getElementById('freelancer'),
          blockChoice = document.getElementById('block-choice'),
          btnExit = document.getElementById('btn-exit'),
          blockCustomer = document.getElementById('block-customer'),
          blockFreelancer = document.getElementById('block-freelancer'),
          formCustomer = document.getElementById('form-customer'),
          modalOrder = document.getElementById('modal-order'),
          modalOrderActive = document.getElementById('modal-order-active'),
          ordersTable = document.getElementById('orders');
   
    const orders = [] ;

    // 5. Функция. Перебирает массив с заказами и на оснавании данных каждого из заказов отрисовывает таблицу с заказами на странице фрилансеров. Напишем эту функцию до всех обработчиков событий.
    const renderOrders = () => {
    
        ordersTable.textContent = '' ; // Очищает таблицу заказов перед отрисовкой. Не позволяет записать в таблицу одни и теже заказы несколько раз.

        orders.forEach(( order, i ) => {
        
            ordersTable.innerHTML += `
                                        
                <tr class="order ${order.active? 'taken':''}" data-number-order=${i}>
                    <td> ${i + 1} </td>
                    <td> ${order.title} </td>
                    <td class="${order.currency}"> </td>
                    <td> ${order.deadline} </td>
                </tr>

                `;
        });   
    };      

    // 1. Обработчик событий. При нажатии на кнопку "Заказчик" скрывает стартовую страницу и делает видимой страницу заказчика и кнопку "выход".
    customer.addEventListener('click', () => {
        blockChoice.style.display = 'none' ;
        btnExit.style.display = 'block';
        blockCustomer.style.display = 'block' ;  
    });

    // 2. Обработчик событий. При нажатии на кнопку "фрилансер" скрывает стартовую страницу и делает видимой страницу фрилансера и кнопку "выход", а так же запускает функцию отрисовывающую таблицу с заказами на странице фрилансера.
    freelancer.addEventListener('click', () => {
        blockChoice.style.display = 'none' ;
        renderOrders();
        btnExit.style.display = 'block';
        blockFreelancer.style.display = 'block' ;
    });

    // 3. Обработчик событий. При нажатии на кнопку "выход" скрывает страницу заказчика, страницу фрилансера и кнопку "выход". После чего делает видимой стартовую страницу.
    btnExit.addEventListener('click', () => {
        btnExit.style.display = 'none';
        blockCustomer.style.display = 'none' ; 
        blockFreelancer.style.display = 'none' ;
        blockChoice.style.display = 'block' ;
    });

    // 4. Обработчик событий. При нажатии на кнопку "отправить заявку", которая находится в форме заказчика, функция перебирает данные введённые в поля формы, и записывает их в объект orderData. После чего данные собранные из формы заказчика добавляются в массив с заказами orders. Так формируется список заказов.
    formCustomer.addEventListener('submit', ( event ) => {
        
        event.preventDefault(); // Отменяет стандартное событие 'submit'(перезагрузку страницы).
        const orderData = {};
       
        for (const elem of formCustomer.elements) {

            if ((elem.tagName === 'INPUT' && elem.type !== 'radio') ||
                (elem.type === 'radio' && elem.checked) ||
                (elem.tagName === 'TEXTAREA')) {

                orderData[elem.name] = elem.value;
                   
                if (elem.type !== 'radio') {

                    elem.value = '' ;
                
                }   

            }
          
        }; 
        
        formCustomer.reset();   // очищает форму заказчика.
        orders.push(orderData); // добавляет данные собранные из формы заказчика в массив с заказами.
    });

    // 6. Обработчик событий. Запускает функцию openModal, при клике по таблице с заказами.
    ordersTable.addEventListener( 'click', ( event ) => {

        const target = event.target;
        const targetOrder = target.closest('.order');

        if(targetOrder) {

            openModal(targetOrder.dataset.numberOrder);
            
        };
    });

    // 7. Функция открытия модального окна.
    const openModal = (numberOrder) => {

        const order = orders[numberOrder]; // Находим заказ в массиве с заказами по номеру заказа.

        const { title, firstName, email, phone, description, amount, currency, deadline, active = false } = order; // вытаскиваем данные о заказе из объекта с заказом.

        const modal = active ? modalOrderActive: modalOrder;
 
        const titleBlock = modal.querySelector('.modal-title '),
              firstNameBlock = modal.querySelector('.firstName'),
              emailBlock = modal.querySelector('.email'),
              descriptionBlock = modal.querySelector('.description'),
              deadlineBlock = modal.querySelector('.deadline'),
              currencyBlock = modal.querySelector('.currency_img'),
              countBlock = modal.querySelector('.count'),
              phoneBlock = modal.querySelector('.phone');

        
            titleBlock.textContent = title;

            firstNameBlock.textContent = firstName;

            emailBlock.textContent = email;
            emailBlock.href = 'mailto:' + email; 

            descriptionBlock.textContent = description;

            deadlineBlock.textContent = deadline;

            currencyBlock.className = 'currency_img';
            currencyBlock.classList.add(currency);

            countBlock.textContent = amount;

            phoneBlock ? phoneBlock.href = 'tel:' + phone : '';

            modal.numberOrder = numberOrder;
        
            modal.style.display = 'flex';

            modal.addEventListener('click', handlerModal ); // Обработчик событий запускающий функцию закрытия модальных окон и переключение состояния заказа.

    };

    // 8. Функция закрывающая модальные окна(модальные окна взятого или активного заказа).
    function handlerModal(event) {

        const target = event.target;
        const modal = target.closest('.order-modal'); // Находим модальные окна и присваеваем в переменную modal.

        const order = orders[modal.numberOrder];

        if (target.closest('.close') || target === modal) {

            modal.style.display = 'none';
        };

        if (target.classList.contains('get-order')) {

            order.active = true;
            modal.style.display = 'none';
            renderOrders();
        };

        if (target.id === 'capitulation') {

            order.active = false;
            modal.style.display = 'none';
            renderOrders();
            console.log(target.id);
        }

        if (target.id === 'ready') {
            orders.splice( orders.indexOf(order), 1); // Находим наш заказа среди масива с заказами и с помощью indexOf определяем его индекс. Далее с помощью метода splice удаляем заказ из массива заказов. 
            modal.style.display = 'none';
            renderOrders();
        }
    };
    
});

// РАЗОБРАТЬСЯ!!! смотреть с 3-го видео 1:42:00. К сайту подключен main.js.