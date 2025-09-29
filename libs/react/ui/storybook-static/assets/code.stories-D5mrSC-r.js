import{j as e}from"./iframe-BtG9MalS.js";import{C as r}from"./code-DO8wtZdT.js";import"./preload-helper-PPVm8Dsz.js";const t={title:"Typography/Code"},s=["label","paragraph"],l={render:()=>e.jsx("div",{className:"flex flex-col gap-16",children:s.map(a=>e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(r,{variant:"label",className:"text-foreground-neutral-subtle",children:a}),e.jsx(r,{variant:a,children:"The quick brown fox jumps over the lazy dog"})]}),e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs(r,{variant:"label",className:"text-foreground-neutral-subtle",children:[a," - Bold"]}),e.jsx(r,{variant:a,bold:!0,children:"The quick brown fox jumps over the lazy dog"})]})]},a))})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-16">
      {variants.map(variant => <div key={variant} className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <Code variant="label" className="text-foreground-neutral-subtle">
              {variant}
            </Code>
            <Code variant={variant}>The quick brown fox jumps over the lazy dog</Code>
          </div>
          <div className="flex flex-col gap-4">
            <Code variant="label" className="text-foreground-neutral-subtle">
              {variant} - Bold
            </Code>
            <Code variant={variant} bold>
              The quick brown fox jumps over the lazy dog
            </Code>
          </div>
        </div>)}
    </div>
}`,...l.parameters?.docs?.source}}};const i=["Default"];export{l as Default,i as __namedExportsOrder,t as default};
