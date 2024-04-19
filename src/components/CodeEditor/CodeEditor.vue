<template>
  <div ref="main" style="width: 100%; height: 100%"></div>
</template>

<script>
import * as monaco from "monaco-editor";
// 引入自定义提示词
import pythonSuggestion from "@/components/CodeEditor/python-suggest";
import goSuggestion from "@/components/CodeEditor/go-suggestion";
const customLanguage={
  "go":goSuggestion,
  "python":pythonSuggestion
}
export default {
  name:"CodeEditor",
  data() {
    return {
      monacoEditor: null,
    };
  },
  props:{
    language:String,
    value:String
  },
  created() {

  },
  watch:{
    value(newCode) {
      this.monacoEditor.setValue(newCode);
    }
  },
  mounted() {
    this.$nextTick(()=>{
      this.initMonaco();
      // 自定义提示词
      this.initCustomLanguage();
    })
  },
  methods: {
    initMonaco() {
      this.monacoEditor = monaco.editor.create(this.$refs.main, {
        theme: "vs-dark", // 主题
        value: this.value, // 默认显示的值
        language: this.language,
        folding: true, // 是否折叠
        foldingHighlight: true, // 折叠等高线
        foldingStrategy: "auto", // 折叠方式
        showFoldingControls: "always", // 是否一直显示折叠
        disableLayerHinting: true, // 等宽优化
        emptySelectionClipboard: false, // 空选择剪切板
        selectionClipboard: false, // 选择剪切板
        automaticLayout: true, // 自动布局
        codeLens: true, // 代码镜头
        scrollBeyondLastLine: false, // 滚动完最后一行后再滚动一屏幕
        colorDecorators: true, // 颜色装饰器
        accessibilitySupport: "on", // 辅助功能支持"auto" | "off" | "on"
        lineNumbers: "on", // 行号 取值： "on" | "off" | "relative" | "interval" | function
        lineNumbersMinChars: 4, // 行号最小字符   number
        enableSplitViewResizing: false,
        readOnly: false, //是否只读  取值 true | false
        fontSize:18
      });
      this.monacoEditor.onDidChangeModelContent(() => {
        this.$emit('change', this.monacoEditor.getValue());
      });
    },
    initCustomLanguage(){
      let language=this.language;
      if(!(Object.keys(customLanguage)).includes(this.language)){
        return
      }
      monaco.languages.registerCompletionItemProvider(this.language, {
        provideCompletionItems: function() {
          let keywords = customLanguage[language];
          let suggestions = keywords.map(function(keyword) {
            return {
              label: keyword,
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: keyword
            };
          });
          return { suggestions: suggestions };
        }
      });
    },
  },
};
</script>
