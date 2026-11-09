const sourceJson = `{
  "event": {
    "title": "Ночь в музее",
    "date": "15 ноября, 18:30",
    "place": "Музей космонавтики, проспект Мира, 111",
    "description": "Вечерняя программа с выставкой и экскурсиями",
    "meeting": "Сбор: 18:30. Начало: 19:00."
  },
  "services": [
    { "id": "guide", "title": "  Экскурсия с гидом  ", "price": 500 },
    { "id": "audio", "title": "Аудиогид", "price": 350 },
    { "id": "catalog", "title": "Каталог выставки", "price": 250 }
  ]
}`;

const serviceForm = document.querySelector('#service-form');
const dataError = document.querySelector('#data-error');
const showProgram = document.querySelector('#show-program');
const program = document.querySelector('#program');

const guide = document.querySelector('#guide');
const audio = document.querySelector('#audio');
const catalog = document.querySelector('#catalog');
const choiceError = document.querySelector('#choice-error');
const result = document.querySelector('#result');
const reportJson = document.querySelector('#report-json');

let data;

try {
  data = JSON.parse(sourceJson);
  serviceForm.hidden = false;
  showProgram.addEventListener('click', showProgramHandler);
  serviceForm.addEventListener('submit', submitHandler);
} catch (error) {
  dataError.textContent = 'Ошибка данных.';
  dataError.hidden = false;
}

function showProgramHandler(){
    program.innerHTML = data.event.meeting;
    program.hidden = false;
}

function buildReport(services, guideChecked, audioChecked, catalogChecked) {
    const selectedServices = services.filter((service) => {
        return (service.id === 'guide' && guideChecked) || 
        (service.id === 'audio' && audioChecked) ||
        (service.id === 'catalog' && catalogChecked);
    });

    const items = selectedServices.map((service) => {
        const { title, price } = service;
        return {title: title.trim(), price: price};
    });

    const total = items.reduce((sum, item) => {
        return sum + item.price;
    }, 0);

    return {count: items.length, total: total, items: items};
}

function submitHandler(event) {
    event.preventDefault();

    const report = buildReport(
        data.services,
        guide.checked,
        audio.checked,
        catalog.checked
    );

    if (report.count === 0) {
        choiceError.textContent = 'Выберите хотя бы одну услугу.';
        choiceError.hidden = false;
        result.hidden = true;
        reportJson.hidden = true;
        return;
    }

    choiceError.hidden = true;

    const titles = report.items.map((item) => item.title);

    result.innerHTML =
        `Выбрано услуг: ${report.count}<br>` +
        `Итого: ${report.total} руб.<br>` +
        titles.join('<br>');

    const json = JSON.stringify(report);
    JSON.parse(json);

    reportJson.textContent = json;
    result.hidden = false;
    reportJson.hidden = false;
}