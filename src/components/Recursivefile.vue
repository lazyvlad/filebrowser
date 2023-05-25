<template>
    <div>
        <ScreenNotification  position="top" message="Link Copied" ref="screen_notification"/>
        <div class="block">
            <div v-if="files.length>0" class="search-box-wrap">
                <input type="text" name="search-box" class="search-box" placeholder="Search Files" v-model="search_key" @keyup="onKeyUp()">
            </div>
        </div>
        <template v-for="item in filteredFiles" :key="item.name" ref="ref_items">  
       
            <template v-if="item.type=='dir'">
              <div class="block">
                <a href="#" :class="item.data.file_ext" @click="onItemClick(item,$event)">
                  <div :class="['img',item.data.file_ext]"></div>
                  <div class="name">
                      <div class="file fs-1-2 bold">{{item.data.basename_file}}</div>
                      <div class="data upper size fs-0-7"><span class="bold">{{item.data.count_dir_files}}</span> files</div>
                      <div class="data upper size fs-0-7"><span class="bold">Size:</span>{{item.data.get_directory_size}}</div>
                  </div>
                </a>
              </div>
              <div v-if="item.subs && item.subs.length>0" class="sub" :class="{'shown':item.shown}">
                  <recursive-file :files="item.subs" @notify-screen="onNotifyScreen"></recursive-file>
              </div>
          </template>
          <template v-else>
            <div class="block">
                <a :href="item.data.full_url" :class="item.data.file_ext" target="_blank">
                <div :class="['img',item.data.file_ext]"></div>
                <div class="name">
                    <div class="file fs-1-2 bold">{{item.data.basename_file}}</div>
                    <div class="data upper size fs-0-7"><span class="bold">Size:</span>{{item.data.file_size}}</div>
                    <div class="data upper modified fs-0-7"><span class="bold">Last modified:</span>{{item.data.last_modified}}</div>
                </div>
                </a>
                <div class="image-preview">
                    <a href="#" @click.prevent="copyLink(item.data.full_url)" class="link-interaction">
                        Copy
                    </a>
                </div>
                <div v-if="item.data.is_image" class="image-preview">
                    <ShowImageVue @previous-image="atPreviousImage(item,$event)" @next-image="atNextImage(item,$event)" :image="{full_url:item.data.full_url,name:item.name}" ref="images" />
                </div>
            </div>
          </template>
        </template>

    </div>
</template>

<style scoped>
.search-box{
    display: block;
    width: 100%;
    height: 4em;
    border:none;
    padding: 0.8em;
}
</style>

<script>

    import { ref } from 'vue';
    import ShowImageVue from './ShowImage.vue';
    import ScreenNotification from './ScreenNotification.vue';
    
    export default {
      // Properties returned from data() become reactive state
      // and will be exposed on `this`.
      emits : ['notifyScreen'],
      name : 'recursive-file',
      components: {
        ShowImageVue,
        ScreenNotification
      },
      props : {

 
        files : {
          type : Array,
          default : ()=>[]
        }
      },
      setup(props,context){
    
        const files = ref(props.files);
        const search_key = ref('');
       
        return {
            files : files,
            search_key : search_key
        }
      },  

      computed : {
            filteredFiles(){

                let filtered= this.files.filter((file_item)=>{

                    const match_regex = this.search_key;
                    var re = new RegExp(match_regex,"g");    


                    if(file_item.name.toLowerCase().match(re))
                        return true;
                    });

                    return filtered;

            }
      },    
    
    // Methods are functions that mutate state and trigger updates.
      // They can be bound as event listeners in templates.
      methods: {

        onNotifyScreen(e){
            console.log('did we do it?');
        },
        copyLink(url){

            console.log(url);

            navigator.clipboard.writeText(url).then(() => {
                // this.$refs.screen_notification.showMessage(`URL: ${url} saved to clipboard`,'success');
                console.log('im sure');
                this.$emit('notifyScreen',{
                    message : `URL: ${url} saved to clipboard`,
                    activity : 'success'
                });

            }, () => {
                console.log('not saved');
            });            

        },

        onKeyUp(e){

        },     
        atPreviousImage(item,e){


            const index = this.files.findIndex((vitem,index) => {
                if(vitem.name == item.name){
                    return true
                }
                else{
                    return false
                }
            });

            this.$refs.images[index].closeImage();  
            
            const previous = this.$refs.images[index-1];

            if(previous)
                previous.showImage();
            
            
        },
        atNextImage(item,e){

            const index = this.files.findIndex((vitem,index)=>{
                if(vitem.name == item.name){
                    return true
                }
                else{
                    return false
                }
            });   
            
            this.$refs.images[index].closeImage();  

            const next = this.$refs.images[index+1];

            if(next)
                next.showImage();
            

        },
        onItemClick(item,e){

            if(item.shown)
                item.shown = !item.shown;
            else
                item.shown =  true;

            e.preventDefault();
            return false;

        }        

      },
      mounted() {

      }
    }
    </script>