<template>
  <div class="dashboard-editor-container">
    <panel-group />

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="16">
        <div class="chart-wrapper">
          <line-chart :chart-data="lineChartData" />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart :pie-data="pieChartData" />
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <el-table :data="todoDataList.list" style="width: 100%" header-row-class-name="tableHead">
          <el-table-column label="TODO List">
            <template slot="header">
              <span style="font-size:16px;">TODO List</span>
            </template>
            <el-table-column prop="title" label="事项描述" />
            <el-table-column prop="triggertime" label="触发时间" />
            <el-table-column prop="total" label="数量" align="center" />
            <el-table-column label="状态">
              <template slot-scope="scope">
                {{ $fn.getDataName({dataList: listTypeInfo.todoActionStatus, value: 'key', label: 'name', data: scope.row.status}) || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="处理动作" align="center">
              <template slot-scope="scope">
                <el-button v-if="scope.row.action===2" type="primary" @click="todoGoto(scope.row.gotourl)">前往</el-button>
                <el-popover v-else v-model="todoVisible[scope.$index]" placement="top-start" width="200px">
                  <div style="text-align: right; margin: 0">
                    <template v-for="status in listTypeInfo.todoActionStatus">
                      <el-button v-if="scope.row.status!=status.key" :key="status.key" type="primary" @click="todoVisible[scope.$index] = false, todoChangeStatus(scope.$index, status.key)">{{ status.name }}</el-button>
                    </template>
                  </div>
                  <el-button slot="reference">操作</el-button>
                </el-popover>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="margin-bottom:30px;">
        <el-card>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="消息通知" name="activity">
              <activity :message-data="homeMessageList" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>

    <!-- <el-row :gutter="8">
      <el-col :xs="{span: 24}" :sm="{span: 24}" :md="{span: 24}" :lg="{span: 12}" :xl="{span: 12}" style="padding-right:8px;margin-bottom:30px;">
        <transaction-table />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <todo-list />
      </el-col>
      <el-col :xs="{span: 24}" :sm="{span: 12}" :md="{span: 12}" :lg="{span: 6}" :xl="{span: 6}" style="margin-bottom:30px;">
        <box-card />
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { homeChartApi, homeTodoApi, homeMessageApi } from '@/api/system/home'
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
import Activity from './components/Activity'
import ThConsts from '@/constants' /* constant */
import PieChart from './components/PieChart'
// import RaddarChart from './components/RaddarChart'
// import BarChart from './components/BarChart'
// import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
// import BoxCard from './components/BoxCard'

export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    PieChart,
    Activity
    // RaddarChart,
    // BarChart,
    // TransactionTable,
    // TodoList,
    // BoxCard
  },
  data() {
    return {
      activeTab: 'activity',
      lineChartData: {
        title: [],
        total: [],
        tablename: ['销售周报']
      },
      pieChartData: {
        data: [],
        title: [],
        tablename: ['品类top10销量分布饼图']
      },
      todoDataList: {
        list: [],
        total: 0
      },
      homeMessageList: {
        list: [],
        total: 0
      },
      todoVisible: [],
      // 相关列表
      listTypeInfo: {
        todoActionStatus: ThConsts.TODO_ACTION_STATUS
      }
    }
  },
  computed: {
    ...mapGetters([
      'theme',
      'dataPermits',
      'staffId'
    ])
  },
  mounted() {
    this.getHomeChart()
    this.getHomeTodo()
    this.getHomeMessage()
  },
  methods: {
    getHomeChart() { // getHomeChart
      const params = { staffId: this.staffId }
      this.$handleAPI('', homeChartApi, params).then(res => {
        if (res.code === '200' || res.code === 200) {
          this.lineChartData.title = res.data.weekly.title
          this.lineChartData.total = res.data.weekly.total
          this.pieChartData.data = res.data.pie.map((item) => {
            return { value: item.total, name: item.title }
          })
          this.pieChartData.title = []
          res.data.pie.map((item) => {
            this.pieChartData.title.push(item.title)
          })
        }
      }).catch(
      )
    },
    getHomeTodo() { // getHomeTodo
      const params = { staffId: this.staffId }
      this.$handleAPI('', homeTodoApi, params).then(res => {
        if (res.code === '200' || res.code === 200) {
          this.todoDataList = res.data
          this.todoVisible.push(false)
        }
      }).catch(
      )
    },
    getHomeMessage() { // getHomeMessage
      const params = { staffId: this.staffId }
      this.$handleAPI('', homeMessageApi, params).then(res => {
        if (res.code === '200' || res.code === 200) {
          this.homeMessageList = res.data
        }
      }).catch(
      )
    },
    todoGoto(url) {
      this.$router.push({ path: url, replace: true })
    },
    todoChangeStatus(index, changeStatus) {
      this.todoDataList.list[index].status = changeStatus
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
