import{r as i,j as t}from"./iframe-BtG9MalS.js";import{c as k,a as C,C as B}from"./code-DO8wtZdT.js";import"./header-BmWrqv3n.js";import"./text-DbR66aaf.js";import{I as h}from"./icon-Btg-LOvQ.js";import"./preload-helper-PPVm8Dsz.js";function x(e,n){if(typeof e=="function")return e(n);e!=null&&(e.current=n)}function w(...e){return n=>{let r=!1;const a=e.map(o=>{const s=x(o,n);return!r&&typeof s=="function"&&(r=!0),s});if(r)return()=>{for(let o=0;o<a.length;o++){const s=a[o];typeof s=="function"?s():x(e[o],null)}}}}function N(e){const n=E(e),r=i.forwardRef((a,o)=>{const{children:s,...c}=a,l=i.Children.toArray(s),u=l.find(z);if(u){const p=u.props.children,j=l.map(m=>m===u?i.Children.count(p)>1?i.Children.only(null):i.isValidElement(p)?p.props.children:null:m);return t.jsx(n,{...c,ref:o,children:i.isValidElement(p)?i.cloneElement(p,void 0,j):null})}return t.jsx(n,{...c,ref:o,children:s})});return r.displayName=`${e}.Slot`,r}var S=N("Slot");function E(e){const n=i.forwardRef((r,a)=>{const{children:o,...s}=r;if(i.isValidElement(o)){const c=I(o),l=V(s,o.props);return o.type!==i.Fragment&&(l.ref=a?w(a,c):c),i.cloneElement(o,l)}return i.Children.count(o)>1?i.Children.only(null):null});return n.displayName=`${e}.SlotClone`,n}var R=Symbol("radix.slottable");function z(e){return i.isValidElement(e)&&typeof e.type=="function"&&"__radixId"in e.type&&e.type.__radixId===R}function V(e,n){const r={...n};for(const a in n){const o=e[a],s=n[a];/^on[A-Z]/.test(a)?o&&s?r[a]=(...l)=>{const u=s(...l);return o(...l),u}:o&&(r[a]=o):a==="style"?r[a]={...o,...s}:a==="className"&&(r[a]=[o,s].filter(Boolean).join(" "))}return{...e,...r}}function I(e){let n=Object.getOwnPropertyDescriptor(e.props,"ref")?.get,r=n&&"isReactWarning"in n&&n.isReactWarning;return r?e.ref:(n=Object.getOwnPropertyDescriptor(e,"ref")?.get,r=n&&"isReactWarning"in n&&n.isReactWarning,r?e.props.ref:e.props.ref||e.ref)}const O=C("rounded-[6px] inline-flex items-center justify-center whitespace-nowrap transition-colors disabled:pointer-events-none shrink-0 outline-none",{variants:{variant:{primary:"bg-background-button-inverted-default text-foreground-contrast-primary shadow-button-inverted hover:bg-background-button-inverted-hover active:bg-background-button-inverted-pressed focus-visible:shadow-button-inverted-focus disabled:bg-background-neutral-disabled disabled:text-foreground-neutral-disabled disabled:shadow-none",secondary:"bg-background-button-neutral-default text-foreground-neutral-base shadow-button-neutral hover:bg-background-button-neutral-hover active:bg-background-button-neutral-pressed disabled:bg-background-neutral-disabled focus-visible:shadow-button-neutral-focus disabled:text-foreground-neutral-disabled disabled:shadow-none",danger:"bg-background-button-danger-default text-foreground-neutral-on-color shadow-button-danger hover:bg-background-button-danger-hover active:bg-background-button-danger-pressed focus-visible:shadow-button-danger-focus disabled:bg-background-neutral-disabled disabled:text-foreground-neutral-disabled disabled:shadow-none",transparent:"bg-background-button-transparent-default text-foreground-neutral-base hover:bg-background-button-transparent-hover active:bg-background-button-transparent-pressed focus-visible:shadow-button-neutral-focus disabled:text-foreground-neutral-disabled",transparentMuted:"bg-background-button-transparent-default text-foreground-neutral-muted hover:bg-background-button-transparent-hover active:bg-background-button-transparent-pressed focus-visible:shadow-button-neutral-focus disabled:text-foreground-neutral-disabled"},size:{"2xs":"px-6 text-xs gap-4",xs:"px-6 py-2 text-xs gap-4",sm:"px-8 py-4 text-sm gap-6",md:"px-10 py-6 text-md gap-8",lg:"px-12 py-8 text-lg gap-8",xl:"px-12 py-10 text-xl gap-10"}},defaultVariants:{variant:"primary",size:"md"}});function d({className:e,variant:n,size:r,asChild:a=!1,children:o,iconLeft:s,iconRight:c,...l}){const u=a?S:"button";return t.jsxs(u,{"data-slot":"button",className:k(O({variant:n,size:r,className:e})),...l,children:[s&&t.jsx(h,{name:s}),o,c&&t.jsx(h,{name:c})]})}d.__docgenInfo={description:"",methods:[],displayName:"Button",props:{asChild:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},iconLeft:{required:!1,tsType:{name:"unknown"},description:""},iconRight:{required:!1,tsType:{name:"unknown"},description:""}}};const v=["primary","secondary","danger","transparent","transparentMuted"],y=["2xs","xs","sm","md","lg","xl"],W={title:"Components/Button",component:d,tags:["autodocs"],argTypes:{variant:{control:"select",options:v},size:{control:"select",options:y},asChild:{control:"boolean"}},args:{children:"Click me",variant:"primary",size:"md"}},f={},b={render:e=>t.jsx("div",{className:"flex flex-col gap-32",children:y.map(n=>t.jsxs("table",{className:"w-fit border-separate border-spacing-x-32 border-spacing-y-16",children:[t.jsx("thead",{children:t.jsxs("tr",{children:[t.jsx("th",{children:n}),t.jsx("th",{children:"Default"}),t.jsx("th",{children:"Hover"}),t.jsx("th",{children:"Active"}),t.jsx("th",{children:"Focus"}),t.jsx("th",{children:"Disabled"})]})}),t.jsx("tbody",{children:v.map(r=>t.jsxs("tr",{children:[t.jsx("td",{children:t.jsx(B,{variant:"label",className:"text-foreground-neutral-subtle",children:r})}),t.jsx("td",{children:t.jsx(d,{...e,variant:r,size:n,children:"Click me"})}),t.jsx("td",{children:t.jsx(d,{...e,variant:r,className:"hover",size:n,children:"Click me"})}),t.jsx("td",{children:t.jsx(d,{...e,variant:r,className:"active",size:n,children:"Click me"})}),t.jsx("td",{children:t.jsx(d,{...e,variant:r,className:"focus",size:n,children:"Click me"})}),t.jsx("td",{children:t.jsx(d,{...e,variant:r,disabled:!0,size:n,children:"Click me"})})]},r))})]},n))})};b.parameters={pseudo:{hover:".hover",active:".active",focusVisible:".focus"}};const g={render:e=>t.jsxs("div",{className:"flex flex-col gap-16",children:[t.jsx("div",{children:t.jsx(d,{...e,iconLeft:"google",children:"Click me"})}),t.jsx("div",{children:t.jsx(d,{...e,iconRight:"microsoft",children:"Click me"})}),t.jsx("div",{children:t.jsx(d,{...e,iconLeft:"google",iconRight:"microsoft",children:"Click me"})})]})};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:"{}",...f.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-col gap-32">
      {sizeOptions.map(size => <table key={size} className="w-fit border-separate border-spacing-x-32 border-spacing-y-16">
          <thead>
            <tr>
              <th>{size}</th>
              <th>Default</th>
              <th>Hover</th>
              <th>Active</th>
              <th>Focus</th>
              <th>Disabled</th>
            </tr>
          </thead>
          <tbody>
            {variantOptions.map(variant => <tr key={variant}>
                <td>
                  <Code variant="label" className="text-foreground-neutral-subtle">
                    {variant}
                  </Code>
                </td>
                <td>
                  <Button {...args} variant={variant} size={size}>
                    Click me
                  </Button>
                </td>
                <td>
                  <Button {...args} variant={variant} className="hover" size={size}>
                    Click me
                  </Button>
                </td>
                <td>
                  <Button {...args} variant={variant} className="active" size={size}>
                    Click me
                  </Button>
                </td>
                <td>
                  <Button {...args} variant={variant} className="focus" size={size}>
                    Click me
                  </Button>
                </td>
                <td>
                  <Button {...args} variant={variant} disabled size={size}>
                    Click me
                  </Button>
                </td>
              </tr>)}
          </tbody>
        </table>)}
    </div>
}`,...b.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: args => <div className="flex flex-col gap-16">
      <div>
        <Button {...args} iconLeft="google">
          Click me
        </Button>
      </div>
      <div>
        <Button {...args} iconRight="microsoft">
          Click me
        </Button>
      </div>
      <div>
        <Button {...args} iconLeft="google" iconRight="microsoft">
          Click me
        </Button>
      </div>
    </div>
}`,...g.parameters?.docs?.source}}};const F=["Default","Variants","Icons"];export{f as Default,g as Icons,b as Variants,F as __namedExportsOrder,W as default};
