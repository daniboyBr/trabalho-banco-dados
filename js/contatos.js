new Vue({
    el: '#app',
    data() {
        return {
            url: 'https://contatosapi.azurewebsites.net/api/contatos',
            errorMessage: '',
            showError: false,
            email: '',
            telefone: '',
            contact: {
                id: '',
                nome: '',
                emails: [],
                telefones: []
            },
            contacts: []
        }
    },
    methods: {
        addTelefone() {
            if (this.telefone.length != 0) {
                let telefone = {
                    numero: this.telefone
                }
                this.contact.telefones.push(telefone);
                this.telefone = '';
            }
        },
        addEmail() {
            if (this.email.length != 0) {
                let email = {
                    endereco: this.email
                }
                this.contact.emails.push(email);
                this.email = '';
            }
        },
        removeEmail(email) {
            this.contact.emails = this.contact.emails.filter(el => {
                return !el.endereco.includes(email);
            });
            this.email = '';
        },
        removeTelefone(numero) {
            this.contact.telefones = this.contact.telefones.filter(el => {
                return el.numero !== numero;
            });
            this.telefones = '';
        },
        saveContact() {
            if (this.contact.id !== '') {
                this.editContact();
            } else {
                this.addContact();
            }
        },
        async addContact() {
            try {
                delete this.contact.id;
                axios.post(this.url, this.contact, {
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                        }
                    })
                    .then(response => {
                        this.cancelEdit();
                        this.getContacts();
                    });
            } catch (error) {
                this.showErrorMessage('Erro ao tentar adicionar um contato.');
            }
        },
        async editContact() {
            try {
                let url = this.url + '/' + this.contact.id;
                axios.put(url, this.contact, {
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                        }
                    })
                    .then(response => {
                        this.cancelEdit();
                        this.getContacts();
                    });
            } catch (error) {
                this.showErrorMessage('Erro ao tentar editar um contato.');
            }
        },
        async removeContact(id) {
            let url = this.url + '/' + id;
            try {
                await axios.delete(url, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    },
                }).then(response => {
                    this.getContacts();
                })
            } catch (error) {
                this.showErrorMessage('Erro ao tentar remover um contato.');
            }
        },
        async getContacts(id = '') {
            let url = this.url;
            if (id !== '') {
                url = url + '/' + id;
            }
            try {
                await axios.get(url, {
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    },
                }).then(response => {
                    if (Array.isArray(response.data)) {
                        this.contacts = response.data;
                    } else {
                        this.contact = response.data;
                    }
                })
            } catch (error) {
                this.showErrorMessage('Erro ao tentar buscar os contatos.');
            }
        },
        showErrorMessage(message) {
            this.errorMessage = message;
            this.showError = true;

            setTimeout(() => {
                this.showError = false;
                this.errorMessage = '';
            }, 3000);
        },
        cancelEdit() {
            this.contact = Object.assign({}, this._contact);
            this.contact.emails = [];
            this.contact.telefones = [];
        }         
    },
    mounted() {
        if (!this.hasOwnProperty('_contact')) {
            this._contact = Object.assign({}, this.contact);
        }
        this.getContacts();
    },
});