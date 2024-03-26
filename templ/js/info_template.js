const userBtns = document.querySelectorAll('.infoBtn');
const fileDialog = document.getElementById('fileDialog');
const closeDialogBtn = document.getElementById('closeDialog');
const fileContent = document.getElementById('fileContent');

userBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const infoId = btn.dataset.infoid;

        fetch('../js/info_template.json')
            .then(response => response.json())
            .then(data => {
                const info = data.info_tmpl.find(info => info.id === parseInt(infoId));
                if (info) {
									let cont='';
                  cont+= "<p><span>Номер блока</span>:"+info.id+"</p>";
									cont+= "<p><span>Название</span>:"+info.name+"</p>";
									cont+= "<p><span>Тип контента</span>:"+info.type_cont+"</p>";
									cont+= "<p><span>Используется на странице</span>:"+info.uses_pages+"</p>";
									cont+= "<p><span>Описание</span>:"+info.description+"</p>";
									fileContent.innerHTML =cont;
                    fileDialog.showModal();
                } else {
                    fileContent.textContent = 'Информация по блоку не найдена';
                    fileDialog.showModal();
                }
            })
            .catch(error => console.error(error));
    });
});

closeDialogBtn.addEventListener('click', () => {
    fileDialog.close();
});