<template>
  <div class="ac_coupon-wrap">
    <div class="ac_coupon-content">
      <d-search css-class="ipt" style="width: 700px" class="xyz1" @search="Search" :data="vals"></d-search>

      <d-table :data="dataSource" :show-loading="showLoading" :lazy="true" table-height="300px" class="xyz2" style="width: 700px">
        <d-column type="index" width="90">
          <template #default="scope">
            {{ `${scope.rowIndex + 1}` }}
          </template>
        </d-column>
        <d-column field="MusicName" header="音乐名字" width="140"></d-column>
        <d-column field="Name" header="作者" width="120"></d-column>
        <d-column field="Hash" header="Hash" width="90"></d-column>
        <d-column field="ID" header="ID" width="90"></d-column>
        <d-column header="音乐" align="right">
          <template #default="scope">
            <d-button @click="MusicButton(scope.row)">下载音乐</d-button>
          </template>
        </d-column>
      </d-table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    // 0是没开始下载
    // 1是开始下载
    let num = 0;
    let name = '';
    const dataSource = ref([]);

    const Search = (val) => {
      name = '';
      name = val;
      console.log(val);
      const startTime = performance.now();
      axios
          .get(`https://dataiqs.com/api/kgmusic/?msg=${val}&count=1000`)
          .then(function (response) {
            const endTime = performance.now(); // 记录结束时间
            const loadingTime = endTime - startTime; // 计算加载时间
            console.log(`表格加载时间：${loadingTime}ms`);

            const text = response.data;
            if (text.hasOwnProperty("data")) {
              const dataArray = text.data;
              const search_all = [];

              for (let i = 0; i < dataArray.length; i++) {
                const name = dataArray[i].name;
                const singername = dataArray[i].singername;
                const hash = dataArray[i].hash;
                search_all.push({ i, name, singername, hash });
              }

              console.log(search_all);

              dataSource.value = search_all.map(item => ({
                MusicName: item.name,
                Name: item.singername,
                Hash: item.hash,
                ID: item.i
              }));
            }
          })
          .catch(function (error) {
            console.log(error);
          });
    };

    const downloadFile = (url) => {
      // 创建一个隐藏的 <a> 元素
      const link = document.createElement('a');
      link.style.display = 'none';
      document.body.appendChild(link);

      // 设置下载链接和文件名
      link.href = url;
      link.download = 'music.mp3'; // 设置下载的文件名

      // 模拟点击下载链接
      link.click();

      // 清理并移除 <a> 元素
      document.body.removeChild(link);
    };

// 在获取到下载链接后调用下载方法
    const MusicButton = (row) => {
      num = 1
      // 把Search val数据调用到这里链接
      const Musicurl = `https://dataiqs.com/api/kgmusic/?msg=${name}&n=${row.ID + 1}`;
      console.log(Musicurl);
      axios.get(Musicurl, { timeout: 10000 })
          .then(function (response) {
            const text = response.data;

            if (text.hasOwnProperty("data")) {
              const url = text.data.song_url;
              if (url) {
                console.log(url);
                downloadFile(url); // 调用下载方法
              } else {
                console.log("没有获得数据1");
              }
            } else {
              console.log("没有获得数据2");
            }
          })
          .catch(error => {
            console.log(error);
          });
      num=0
    };
    return {
      Search,
      MusicButton,
      dataSource,
    };
  },
});
</script>


<style scoped>
.xyz1 {
  position: absolute;
  top: -280px;
  left: -350px;
}
.xyz2 {
  position: absolute;
  top: -180px;
  left: -350px;
}
.ac_coupon-wrap {
  height: 0;
  padding-top: 15.16%;
  position: relative;

  .ac_coupon-content {
    position: absolute;
    top: auto;
    width: auto;
    height: auto;
    background-size: cover;
  }
}

</style>
