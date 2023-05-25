<template >
    <div :class="[{'screen-notification' : true,'shown':is_shown, 'green' : (action=='success')},position]">
        {{message}}
    </div>
</template>
<script>
    import { ref } from 'vue';
    export default {
        props : {
            is_shown : {
                type : Boolean,
                default : false
            },
            position : {
                type : String,
                default : 'top'
            },  
            message : {
                type : String,
                default : ''            
            }
        },
        emits : ['update:is_shown','update:message'],
        expose : ['showMessage','hideMessage'],
        setup(props){
            const message = ref(props.message);

            const is_shown = ref(props.is_shown);

            const animation_timeout = ref(null);


            return {
                message : message,
                is_shown : is_shown,
                position : ref(props.position),
                animation_timeout : animation_timeout,
                action : ref('')
            }
        },
        watch : {
            is_shown(newvalue,oldvalue){
                if(newvalue){
                    this.animation_timeout =setTimeout(() => {
                        this.is_shown = false
                        this.$emit('update:is_shown',false)
                    }, 2000);
                }
                else{
                    clearTimeout(this.animation_timeout);
                }
            },
        },
        methods : {
            showMessage(new_message,action){
                this.is_shown = true;
                if(action)
                    this.action = action;
                else
                    this.action = '';
                if(new_message){
                    this.message = new_message;
                }
                this.$emit('update:is_shown',this.is_shown)
                this.$emit('update:message',this.message)
            },
            hideMessage(){
                this.is_shown = false;
                this.$emit('update:is_shown',this.is_shown)
                this.$emit('update:message',this.message)
            }

        },
        mounted() {

        }
    }
</script>
<style scoped>
.screen-notification{
    width: 100%;
    display: block;
    position: fixed;
    background: #333;
    padding: 2em;
    color: #fff;
    opacity: 1;
    z-index: 200;
    transition: transform 1s;
    transition-timing-function :cubic-bezier(0.075, 0.82, 0.165, 1);
    text-align: center;
}

.screen-notification.green{
    background: #2f832f;
}

.screen-notification.top{
    transform : translate(0%, -100%);
    top : 0px;
    left:0px;
}
.screen-notification.bottom{
    bottom:0px;
    transform : translate(0%, 100%);
    left:0px;
}

.screen-notification.shown{
    transform: translate(0%, 0%);
}
</style>