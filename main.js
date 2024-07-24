
        const modal = document.querySelector(".editar-modal-container");
        const carregando = document.querySelector(".carregando");
        const containerTarefas = document.querySelector(".container-tarefas");
        const pesquisaInput = document.getElementById("pesquisa");
        const pesquisaButton = document.querySelector(".botao-pesquisar");
        const mensagemErro = document.querySelector(".input-pesquisa-container p");

        async function getTarefasByUserId(userId) {
            const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/todos`);

            if (response.ok) {
                const tarefas = await response.json();
                mostrarTarefas(tarefas);
                mensagemErro.style.display = "none";
            } else {
                mensagemErro.style.display = "block";
                console.error("Usuário não encontrado");
            }
        }


        function mostrarTarefas(tarefas) {
            const containerTarefas = document.querySelector(".container-tarefas");
            containerTarefas.innerHTML = "";
            tarefas.forEach(tarefa => {
                containerTarefas.insertAdjacentHTML('beforeend', `
        <div class="tarefa">
            <div style="display: flex; align-items: center;">
                <div class="dadosTodo">
                    <h2>${tarefa.title}</h2>
                    <p class="descricao">Sem descrição</p>
                    <p class="userId">Usuário: ${tarefa.userId}</p>
                </div>
            </div>
            <div style="display: flex;">
                <button class="completa"><img src="img/check.png" alt="Completar"></button>
                <button class="editar"><img src="img/edit.png" alt="Editar"></button>
                <button class="deletar"><img src="img/delete.png" alt="Deletar"></button>
            </div>
        </div>
    `);
            });
        }

        pesquisaButton.addEventListener("click", () => {
            const userId = parseInt(pesquisaInput.value, 10);
            if (isNaN(userId) || userId <= 0) {
                mensagemErro.style.display = "block";
            } else {
                getTarefasByUserId(userId);
            }
        });

        document.querySelector(".adicionar").onclick = () => {
            adicionarNovaTarefa();
        }

        async function adicionarNovaTarefa() {
            const carregandoNova = document.querySelector(".carregando-nova");
            const textBotaoAdd = document.querySelector(".texto-add");

            carregandoNova.style.display = "block";
            textBotaoAdd.style.display = "none";

            let title = document.querySelector("#titulo").value;
            let descricao = document.querySelector("#descricao").value;

            if (!title || !descricao) {
                alert("Coloque os dados da tarefa");
                carregandoNova.style.display = "none";
                textBotaoAdd.style.display = "block";
            } else {
                const request = await fetch("https://jsonplaceholder.typicode.com/todos", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        userId: 11,
                        title: title,
                        completed: false
                    })
                });
                const resposta = await request.json();

                if (!request.ok) {
                    console.log("Erro ao criar nova tarefa");
                } else {
                    containerTarefas.insertAdjacentHTML('afterbegin', `
                <div class="tarefa nova-tarefa">
                    <div style="display: flex; align-items: center;">
                        <div class="dadosTodo">
                            <h2>${title}</h2>
                            <p class="descricao">${descricao}</p>
                            <p class="userId">Usuário: ${resposta.userId}</p>
                        </div>
                    </div>
                    <div style="display: flex;">
                        <button class="completa"><img src="img/check.png" alt="Completar"></button>
                        <button class="editar"><img src="img/edit.png" alt="Editar"></button>
                        <button class="deletar"><img src="img/delete.png" alt="Deletar"></button>
                    </div>
                </div>
            `);

                    const novaTarefa = document.querySelector('.nova-tarefa');
                    novaTarefa.classList.remove('nova-tarefa');

                    novaTarefa.querySelector('.editar').onclick = () => {
                        const dados = {
                            id: resposta.id,
                            userId: resposta.userId,
                            completed: resposta.completed,
                            title: title,
                            descricao: descricao
                        }
                        mostrarModalEditar(dados, novaTarefa);
                    }

                    novaTarefa.querySelector('.deletar').onclick = () => {
                        deletarTarefa(resposta.id);
                        novaTarefa.remove();
                    }

                    novaTarefa.querySelector('.completa').onclick = () => {
                        let completa = !resposta.completed;
                        completarTarefa(resposta.id, completa);
                        resposta.completed = completa;

                        if (completa) {
                            novaTarefa.querySelector('h2').style.textDecoration = "line-through";
                            novaTarefa.querySelector("p").style.textDecoration = "line-through";
                        } else {
                            novaTarefa.querySelector('h2').style.textDecoration = "none";
                            novaTarefa.querySelector("p").style.textDecoration = "none";
                        }
                    }

                    carregandoNova.style.display = "none";
                    textBotaoAdd.style.display = "block";
                }
            }
        }

        async function mostrarTodasTarefas() {
            carregando.style.display = "block";
            containerTarefas.style.display = "none";

            const request = await fetch('https://jsonplaceholder.typicode.com/todos');
            if (!request.ok) {
                console.log("Erro na requisição");
            } else {
                const resposta = await request.json();

                resposta.sort((a, b) => b.id - a.id);

                carregando.style.display = "none";
                containerTarefas.style.display = "block";

                containerTarefas.innerHTML = "";
                resposta.forEach(item => {
                    containerTarefas.innerHTML += `
                <div class="tarefa">
                    <div style="display: flex; align-items: center;">
                        <div class="dadosTodo">
                            <h2>${item.title}</h2>
                            <p class="descricao">Sem descrição</p>
                            <p class="userId">Usuário: ${item.userId}</p>
                        </div>
                    </div>
                    <div style="display: flex;">
                        <button class="completa"><img src="img/check.png" alt="Completar"></button>
                        <button class="editar"><img src="img/edit.png" alt="Editar"></button>
                        <button class="deletar"><img src="img/delete.png" alt="Deletar"></button>
                    </div>
                </div>
            `;
                });


                document.querySelectorAll(".tarefa").forEach((item, index) => {
                    const tarefa = resposta[index];

                    if (tarefa.completed) {
                        item.querySelector('h2').style.textDecoration = "line-through";
                        item.querySelector("p").style.textDecoration = "line-through";
                    }

                    item.querySelector('.editar').onclick = () => {
                        const dados = {
                            id: tarefa.id,
                            userId: tarefa.userId,
                            completed: tarefa.completed,
                            title: item.querySelector("h2").innerText,
                            descricao: item.querySelector(".descricao").innerText
                        }
                        mostrarModalEditar(dados, item);
                    }

                    item.querySelector('.deletar').onclick = () => {
                        deletarTarefa(tarefa.id);
                        item.remove();
                    }

                    item.querySelector('.completa').onclick = () => {
                        let completa = !tarefa.completed;
                        completarTarefa(tarefa.id, completa);
                        tarefa.completed = completa;

                        if (completa) {
                            item.querySelector('h2').style.textDecoration = "line-through";
                            item.querySelector("p").style.textDecoration = "line-through";
                        } else {
                            item.querySelector('h2').style.textDecoration = "none";
                            item.querySelector("p").style.textDecoration = "none";
                        }
                    }
                });
            }
        }


        async function completarTarefa(id, isCompleted) {
            const request = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    completed: isCompleted
                })
            });

            if (!request.ok) {
                console.log("Erro na atualização");
            }
        }

        function mostrarModalEditar(todo, pai) {
            modal.showModal();
            modal.querySelector(".cancelar-edicao").onclick = () => modal.close();
            window.onclick = function (event) {
                if (event.target === modal) {
                    modal.close();
                }
            }

            const mudarTitulo = document.querySelector(".titulo-editar");
            const mudarDescricao = document.querySelector(".descricao-editar");

            mudarTitulo.value = todo.title;
            mudarDescricao.value = todo.descricao || "Sem descrição";


















            document.querySelector(".salvar-edicao").onclick = () => {
                const novoDado = {
                    id: todo.id,
                    userId: todo.userId,
                    title: mudarTitulo.value,
                    descricao: mudarDescricao.value
                }
                modal.close();
                atualizarTarefa(novoDado);
                pai.querySelector("h2").innerText = novoDado.title;
                pai.querySelector("p").innerText = novoDado.descricao;
            }
        }

        async function atualizarTarefa(todo) {
            const request = await fetch(`https://jsonplaceholder.typicode.com/todos/${todo.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(todo)
            });

            if (!request.ok) {
                console.log("Erro na atualização");
            }
        }

        async function deletarTarefa(id) {
            const request = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                method: "DELETE",
            });

            if (!request.ok) {
                console.log("Erro ao deletar");
            }
        }

        (function () {
            mostrarTodasTarefas();
        })();

        function pesquisarTarefasUser() {
            pesquisar.onclick = (e) => {
                const id = Number(inputPesquisar.value);

                if (isNaN(id) || id === 0 || id > 10) {
                    document.querySelector('.input-pesquisa-container').classList.add('input-pesquisa-container-erro');
                } else {
                    getAllToDosOfUser(id);
                    document.querySelector('.input-pesquisa-container').classList.remove('input-pesquisa-container-erro');
                }
            }
        }

        async function getAllToDosOfUser(userId) {
            carregando.style.display = "block";
            const container = document.querySelector(".container-tarefas");
            container.style.display = "none";

            const request = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/todos`);

            if (request.ok) {
                const data = await request.json();
                container.innerHTML = "";

                for (let item of data) {
                    container.insertAdjacentHTML('afterbegin', `
        <div class="tarefa">
            <div style="display: flex; align-items: center;">
                <button class="completa"><img src="img/check.png" alt="Completar"></button>
                <div class="dadosTodo">
                    <h2>${item.title}</h2>
                    <p>${item.completed ? 'Concluída' : 'Pendente'}</p>
                    <p class="userId">${item.userId}</p>
                </div>
            </div>
            <div style="display: flex;">
                <button class="editar"><img src="img/edit.png" alt="Editar"></button>
                <button class="deletar"><img src="img/delete.png" alt="Deletar"></button>
            </div>
        </div>
    `);
                }

                document.querySelectorAll(".tarefa").forEach((item, index) => {
                    if (data[index].completed) {
                        item.querySelector('h2').style.textDecoration = "line-through";
                        item.querySelector("p").style.textDecoration = "line-through";
                    } else {
                        item.querySelector('h2').style.textDecoration = "none";
                        item.querySelector("p").style.textDecoration = "none";
                    }

                    item.querySelector('.editar').onclick = () => {
                        const dados = {
                            id: data[index].id,
                            userId: data[index].userId,
                            completed: data[index].completed,
                            title: item.querySelector("h2").innerText,
                            descricao: item.querySelector("p").innerText
                        }
                        mostrarModalEditar(dados, item);
                    }

                    item.querySelector('.deletar').onclick = () => {
                        deletarTarefa(data[index].id);
                        item.remove();
                    }

                    item.querySelector('.completa').onclick = () => {
                        let completa = !data[index].completed;
                        completarTarefa(data[index].id, completa);
                        data[index].completed = completa;

                        const pai = item.querySelector('.dadosTodo');
                        if (completa) {
                            pai.querySelector('h2').style.textDecoration = "line-through";
                            pai.querySelector("p").style.textDecoration = "line-through";
                        } else {
                            pai.querySelector('h2').style.textDecoration = "none";
                            pai.querySelector("p").style.textDecoration = "none";
                        }
                    }
                });

                carregando.style.display = "none";
                container.style.display = "block";
            } else {
                console.error("Erro na pesquisa");
            }
        }

   