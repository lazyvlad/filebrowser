<template>
    <a href="#" @click.prevent="showImage" class="link-interaction">Show Image</a>
    <div :class="{'full-screen': true, 'shown':shown}">
        <div class="image-controls">

            <a href="#" @click="$emit('previousImage')">Previous Image</a>
            <a href="#" @click="$emit('nextImage')">Next Image</a>
            <a href="#" @click.prevent="closeImage">Close Image</a>
        </div>
        <div class="image-controls">
            <a :href="computedLink" target="_blank">{{computedLink}}</a>            
        </div>
        <img :src="computedLink" :alt="image.name"/>
        <!-- <img src="../assets/placeholder.svg" class="logo placeholder" alt="Placeholder Image" style="display:none"/>         -->
    </div>
</template>
<script>
    import { ref } from 'vue';    
    export default {
        emits: ['previousImage', 'nextImage'],
        props : {
            image :{
                type : Object,
                default : null
            }
        },
        setup(props,context) {
            const image = ref(props.image);
            const shown = ref(false)

            return {
                image:image,
                shown:shown
            }
        },
        computed:{
            computedLink(){
                if(this.shown)
                    return this.image.full_url;
                else
                    return '';
            }
        },  
        methods : {
            previousImage(){

            },
            nextImage(){

            },
            showImage(e){

                this.shown = true;

            },
            closeImage(e){
                this.shown = false;

            }
        }
}
</script>

<style scoped>
    .link-interaction{
        text-align: center;
    }
    .full-screen{
        width: 100vw;
        height: 100vh;
        position: fixed;
        top:0;
        left:0;
        display: none;
        flex-direction: column;
        background: rgb(29, 29, 29);
    }
    .full-screen.shown{
        display: flex;
    }
    .image-controls{
        display: flex;
        justify-content: center;        
    }

    img{
        display: block;
        margin:auto;
        max-height: 70vh;
        max-width: 95vw;
    }
</style>