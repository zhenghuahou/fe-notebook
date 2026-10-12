<template>
  <div class="agreement-page">
    <!-- PDF 阅读区域 -->
    <div
      ref="pdfContainer"
      class="pdf-container"
      @scroll="handleScroll"
    >
      <!-- 这里替换成你的 PDF 渲染组件 -->
      <iframe
        :key="currentIndex"
        :src="currentPdf"
        class="pdf"
      />
    </div>

    <!-- 底部按钮 -->
    <div class="footer">
      <button
        :disabled="!canNext"
        @click="handleNext"
      >
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pdfList: [
        'pdf1',
        'pdf2',
        'pdf3',
        'pdf4',
        'pdf5'
      ],

      currentIndex: 0,

      // 当前 PDF 倒计时
      countdown: 5,

      // 当前 PDF 是否滚动到底部
      isScrolledToBottom: false,

      timer: null
    }
  },

  computed: {
    // 当前 PDF
    currentPdf() {
      return this.pdfList[this.currentIndex]
    },

    // 下一步按钮是否可以点击
    canNext() {
      return this.countdown === 0 && this.isScrolledToBottom
    },

    // 按钮文字
    buttonText() {
      if (this.countdown > 0) {
        return `请阅读 ${this.countdown}s`
      }

      if (!this.isScrolledToBottom) {
        return '请阅读到底部'
      }

      return this.currentIndex === this.pdfList.length - 1
        ? '完成'
        : '下一步'
    }
  },

  mounted() {
    this.startCountdown()
  },

  beforeDestroy() {
    this.clearTimer()
  },

  methods: {
    /**
     * 开始当前 PDF 的倒计时
     */
    startCountdown() {
      this.clearTimer()

      this.countdown = 5
      this.isScrolledToBottom = false

      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--
        }

        if (this.countdown === 0) {
          this.clearTimer()
        }
      }, 1000)
    },

    /**
     * 清除倒计时
     */
    clearTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },

    /**
     * PDF 滚动事件
     */
    handleScroll(event) {
      const el = event.target

      // 容差 5px，避免小数或浏览器计算误差
      const isBottom =
        el.scrollTop + el.clientHeight >= el.scrollHeight - 5

      if (isBottom) {
        this.isScrolledToBottom = true
      }
    },

    /**
     * 点击下一步
     */
    handleNext() {
      // 双重保险
      if (!this.canNext) {
        return
      }

      // 最后一个 PDF
      if (this.currentIndex >= this.pdfList.length - 1) {
        this.handleComplete()
        return
      }

      // 切换到下一个 PDF
      this.currentIndex++

      // 等 DOM 更新后，重新开始当前 PDF
      this.$nextTick(() => {
        const container = this.$refs.pdfContainer

        // 滚动位置重置到顶部
        if (container) {
          container.scrollTop = 0
        }

        // 重置倒计时和滚动状态
        this.startCountdown()
      })
    },

    /**
     * 全部阅读完成
     */
    handleComplete() {
      console.log('全部协议阅读完成')

      this.clearTimer()

      // TODO:
      // 调接口 / 提交协议 / 关闭弹窗等
    }
  }
}
</script>

<style scoped>
.agreement-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.pdf-container {
  flex: 1;
  overflow-y: auto;
}

.pdf {
  width: 100%;
  height: 1000px;
}

.footer {
  flex-shrink: 0;
  padding: 16px;
  text-align: center;
}

.footer button {
  width: 200px;
  height: 40px;
}
</style>