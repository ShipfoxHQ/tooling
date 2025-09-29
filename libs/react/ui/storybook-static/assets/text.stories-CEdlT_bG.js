import{j as e}from"./iframe-BtG9MalS.js";import{C as r}from"./code-DO8wtZdT.js";import{T as t}from"./text-DbR66aaf.js";import"./preload-helper-PPVm8Dsz.js";const u={title:"Typography/Text"},i=["xs","sm","md","lg","xl"],s={render:()=>e.jsx("div",{className:"flex flex-col gap-16",children:i.map(a=>e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsx(r,{variant:"label",className:"text-foreground-neutral-subtle",children:a}),e.jsx(t,{size:a,children:"The quick brown fox jumps over the lazy dog"})]}),e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs(r,{variant:"label",className:"text-foreground-neutral-subtle",children:[a," - Bold"]}),e.jsx(t,{size:a,bold:!0,children:"The quick brown fox jumps over the lazy dog"})]})]},a))})},o="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",l={render:()=>e.jsx("div",{className:"flex flex-col gap-16",children:i.map(a=>e.jsxs("div",{className:"grid grid-cols-2 gap-8",children:[e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs(r,{variant:"label",className:"text-foreground-neutral-subtle",children:[a," - Regular"]}),e.jsx(t,{size:a,compact:!1,children:o})]}),e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs(r,{variant:"label",className:"text-foreground-neutral-subtle",children:[a," - Compact"]}),e.jsx(t,{size:a,compact:!0,children:o})]})]},a))})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-16">
      {sizes.map(size => <div key={size} className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <Code variant="label" className="text-foreground-neutral-subtle">
              {size}
            </Code>
            <Text size={size}>The quick brown fox jumps over the lazy dog</Text>
          </div>
          <div className="flex flex-col gap-4">
            <Code variant="label" className="text-foreground-neutral-subtle">
              {size} - Bold
            </Code>
            <Text size={size} bold>
              The quick brown fox jumps over the lazy dog
            </Text>
          </div>
        </div>)}
    </div>
}`,...s.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-16">
      {sizes.map(size => <div key={size} className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <Code variant="label" className="text-foreground-neutral-subtle">
              {size} - Regular
            </Code>
            <Text size={size} compact={false}>
              {textParagraph}
            </Text>
          </div>
          <div className="flex flex-col gap-4">
            <Code variant="label" className="text-foreground-neutral-subtle">
              {size} - Compact
            </Code>
            <Text size={size} compact={true}>
              {textParagraph}
            </Text>
          </div>
        </div>)}
    </div>
}`,...l.parameters?.docs?.source}}};const x=["Default","Paragraph"];export{s as Default,l as Paragraph,x as __namedExportsOrder,u as default};
