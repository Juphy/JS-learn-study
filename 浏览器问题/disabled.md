## Angular+AntD
input以及textaarea等disabled时在firefox浏览器下无法选中复制，修改样式pointer-events: all即可。

## React+AntD
在配合Antd开发React中，我们一般讲Antd的Input组件多封装一层我们自己的组件，可以统一修改组件的样式和逻辑，在处理火狐禁用复制功能时也是在封装的这一层组件做事情。
```
render() {
  const { disabled } = this.props;
  const that = this;
  return （
    <Input
      className={disabled ? `ant-input-disabled ${className || ''}` : `${className || ''}`}
      {...disabled ? {
        readOnly: true
      } : {}}
      {...readonly || readOnly ? {
        onChange: (e) => e.preventDefault()
      } : {}}
      {
        ...function () {
          const {
              disabled,
              className,
              ...newData
          } = that.props;
          if (that.props.readOnly || that.props.readonly) {
              delete newData.onChange;
              return newData;
          } else {
              return newData;
          }
        }()
      }
  />）;
}
```
具体思路就是捕获到disabled属性，删除该属性，设置readonly=true。然后再附上禁用的class类，造成假禁用的效果。

## Vue+Element-ui
Vue的解决思路也是一样的，封装一层自己的组件，删除disabled属性，设置为readonly。
```
<template>
  <el-input
    v-bind="$attrs"
    v-on="$listeners"
    ref="input"
  >
  <span v-if="$slots.prefix" slot="prefix">
    <slot name="prefix"></slot>
  </span>
    <span v-if="$slots.suffix" slot="suffix">
    <slot name="suffix"></slot>
  </span>
    <span v-if="$slots.prepend" slot="prepend">
    <slot name="prepend"></slot>
  </span>
    <span v-if="$slots.append" slot="append">
    <slot name="append"></slot>
  </span>
  </el-input>
</template>
<script>
export default {
  name: 'crInputDemo',
  data() {
    return {
    };
  },
  mounted() {
  },
  computed: {
    attrs() {
      const newAttrs = JSON.parse(JSON.stringify(this.$attrs));
      if (newAttrs.disabled || newAttrs.disabled === '') {
        delete newAttrs.disabled;
        newAttrs.readonly = true;
      } else {
        newAttrs.readonly = false;
      }
      return newAttrs;
    },
  },
  watch: {

  },
};
</script>
```
当我们以为这个问题就此解决的时候，发现Element-ui的Form组件如果设置了disabled属性，在Form表单的每一个表单组件内部都拿不到disabled属性了，但是表单组件却依旧被禁用。

这个时候，明显修改disabled属性已经不能解决问题了，在使用vue-tools观察el-input组件内部变量中，发现在设置Form的disabled后，虽然el-input等各种组件拿不到传入的disabled attrs，但是在computed中可以通过inputDisabled属性拿到该组件是否禁用的标识。

所以我们修改了组件的逻辑，如果捕获到this.$refs.input.inputDisabled为true时，给组件增加readonly属性，在多次测试后，我们无法修改el-input内部的inputDisabled属性，增加的readonly属性并没有起作用。最后我们只能通过暴力的获取input dom删除disabled标签属性，增加readonly标签属性来解决问题。

```
mounted() {
    this.$nextTick(() => {  
        const el = this.$refs.input.$el.children[0];  
        if (el.hasAttribute('disabled')) {    
            el.removeAttribute('disabled');    
            el.setAttribute('readonly', true)  
        }
    });
}
```
然后经过一番的折腾，结果这个需求被砍了，因为火狐上readonly框会有红色的边框围住，并且无法禁止focus，blur事件。
