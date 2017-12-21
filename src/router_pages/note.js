var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");

var moment2 = require("moment");

var Note = {
    beforeMount: function() {
        this.$emit('getNoteList');
        console.log("Opened note", Router.currentParams.uuid, this.getList, this.noteList, this.searchFor);
    },
    props: {
        userInfo: Object,
        siteInfo: Object,
        getList: String,
        noteList: {
            type: Array,
            default: function() {
                return [];
            }
        },
        searchFor: String
    },
    computed: {
        note: function() {
            var uuid = Router.currentParams.uuid;
            var nid;

            if (this.noteList === null) return {
                "uuid": uuid,
                "title": "",
                "body": "",
                "todoCheck": "",
                "lastedited": "",
                "encrypted": false
            };

            var editableNotes = this.noteList.filter(function(a, b) {
                nid = a.uuid === uuid ? b : nid;
                return a.uuid === uuid;
            });
            if (editableNotes.length !== 1) return false;

            return editableNotes[0];
        },
        isLoggedIn: function() {
            if (this.userInfo == null) return false;
            return this.userInfo.cert_user_id != null;
        },
        curList: function() {
            var lists = ["l", "c"];
            var listsn = ["local", "synced"];
            return listsn[lists.indexOf(this.getList)];
        }
    },
    methods: {
        goto: function(to) {
            Router.navigate(to);
        },
        setSearch: function(s) {
            this.searchFor = s;
            console.log("Searching", s);
            this.$emit('setSearch', s);
        },
        todoToggle: function() {
            this.$emit('todoToggle', this.note);
        },
        editNote: function() {
            this.$emit('editNote', this.note);
        },
        deleteNote: function() {
            this.$emit('deleteNote', this.note);
            this.goto('/app');
        },
        moment: moment2
    },
    template: `
        <div class="modal-lg modal active">
            <div class="modal-overlay" v-on:click.prevent="goto('/app')"></div>
            <div class="modal-container">
                <div class="modal-header">
                    <button class="btn btn-action btn-link float-right tooltip tooltip-bottom" data-tooltip="Close editor" v-on:click.prevent="goto('/app')">
                        <i class="icon icon-cross"></i>
                    </button>
                    <div class="modal-title h5">
                        <div class="input-group">
                            <input type="text" class="form-input" placeholder="Title" v-model="note.title" v-on:change="editNote" />
                            <button class="btn btn-action input-group-btn tooltip tooltip-bottom" v-bind:data-tooltip="note.todoCheck ? 'Un-tick!' : 'Tick!'" v-on:click.prevent="todoToggle">
                                <i v-bind:class="'icon icon-' + (note.todoCheck ? 'check' : 'plus')"></i>
                            </button>
                        </div>
                    </div>
                    <div class="modal-subtitle text-gray">{{ moment(note.lastedited, "x").format("MMMM Do, YYYY - HH:mm:ss") }}</div>
                </div>
                <div class="modal-body" style="height: 50vh;">
                    <div class="content" style="height: 100%;">
                        <div class="col-12" style="height: 100%;">
                            <textarea style="height: 100%; resize: none;" class="form-input" placeholder="Content" v-model="note.body" v-on:change="editNote"></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-action btn-link tooltip tooltip-bottom float-left" data-tooltip="Share"><i class="mdi">share</i></button>
                    <button class="btn btn-action btn-link tooltip tooltip-bottom float-left" data-tooltip="Encrypt"><i class="mdi">lock_outline</i></button>
                    <button class="btn btn-action btn-link tooltip tooltip-bottom" data-tooltip="Delete" v-on:click.prevent="deleteNote"><i class="mdi">delete_forever</i></button>
                </div>
            </div>
        </div>
    `
};

module.exports = Note;