var Vue = require("vue/dist/vue.min.js");
var Router = require("../router.js");

var Home = {
    beforeMount: function() {
        console.log("Loaded home");
    },
    methods: {
        goto: function(to) {
            Router.navigate(to);
        }
    },
    template: `
        <div>
            <div class="empty">
                <div class="empty-icon">
                    <i class="icon icon-people"></i>
                </div>
                    <p class="empty-title h5">You have no new messages</p>
                    <p class="empty-subtitle">Click the button to start a conversation.</p>
                <div class="empty-action">
                    <button class="btn btn-primary">Send a message</button>
                </div>
            </div>
            <testlist></testlist>
        </div>
    `
};

Vue.component('testlist', {
    methods: {},
    template: `
        <div class="container">
            <div class="columns" v-for="i in 20">
                <div class="col-4 card" v-for="i2 in 3">
                    <div class="card-header">
                        <button class="btn btn-action btn-link btn-sm float-right"><i class="icon icon-plus"></i></button>
                        <div class="card-title h5">{{ i2 }}</div>
                        <div class="card-subtitle text-gray">{{ i }}</div>
                    </div>
                    <div class="card-body">
                        A note
                    </div>
                    <div class="card-footer">
                    </div>
                </div>
            </div>
        </div>
    `
});

module.exports = Home;