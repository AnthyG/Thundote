var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");

Vue.component("note-card", {
    props: ["cert_user_id", "noteData"],
    data: function() {
        return {
            note: this.noteData
        }
    },
    computed: {},
    methods: {},
    template: `
        <div class="card">
            <div class="card-header">
                <button class="btn btn-action btn-link btn-sm float-right"><i class="icon icon-plus"></i></button>
                <div class="card-title h5">{{ note.title }}</div>
                <div class="card-subtitle text-gray">{{ note.lastedited }}</div>
            </div>
            <div class="card-body">
                {{ note.body }}
            </div>
            <div class="card-footer">
                <button class="btn btn-primary">Share</button>
                <button class="btn btn-link">Encrypt</button>
            </div>
        </div>
    `
});