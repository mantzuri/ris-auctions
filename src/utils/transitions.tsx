import { MutableRefObject, } from "react";
import React from "react";
import Transition from "react-transition-group/Transition";

const duration = 1000;

const fadeDefaultStyle = {
  transition: `opacity ${duration}ms ease-in-out `,
  opacity: 0,
};

const fadeTransitionsStates: { [key: string]: any } = {
  entering: { opacity: 1, height: "auto" },
  entered: { opacity: 1, height: "auto" },
  exiting: { opacity: 0, height: 0 },
  exited: { opacity: 0, height: 0 },
};

type FadeProps = {
  in: boolean | undefined,
  children: any,
  nodeRef: MutableRefObject<any>
}

export const Fade = (
  { in: inProp, children, nodeRef }: FadeProps
) =>
  <Transition
    in={inProp}
    timeout={duration}
    nodeRef={nodeRef}
  >
    {(state) => (
      <>
        {React.Children.map(children, (child) =>
          React.cloneElement(child, {
            ref: nodeRef,
            style: {
              ...fadeDefaultStyle,
              ...fadeTransitionsStates[state]
            }
          })
        )}
      </>
    )}
  </Transition>

const slideDefaultStyle = {
  transition: `transform ${duration}ms ease-in-out`,
  transform: "translateX(100%)",
};

const slideTransitionsStates: { [key: string]: any } = {
  entering: { transform: "translateX(0)" },
  entered: { transform: "translateX(0)" },
  exiting: { transform: "translateX(100%)" },
  exited: { transform: "translateX(100%)" },
};


export const Slide = (
  { in: inProp, children, nodeRef }: FadeProps
) =>
  <Transition
    in={inProp}
    timeout={duration}
    nodeRef={nodeRef}
  >
    {(state) => (
      <>
        {children({
          ref: nodeRef,
          style: {
            ...slideDefaultStyle,
            ...slideTransitionsStates[state]
          }
        })}
      </>
    )}
  </Transition>


const collapseDefaultStyle = {
  transition: `height ${duration}ms ease-in-out`,
  height: 0,
};

const collapseTransitionsStates: { [key: string]: any } = {
  entering: { height: "auto" },
  entered: { height: "auto" },
  exiting: { height: 0 },
  exited: { height: 0 },
};

export const Collapse = (
  { in: inProp, children, nodeRef }: FadeProps
) =>
  <Transition
    in={inProp}
    timeout={duration}
    nodeRef={nodeRef}
  >
    {(state) => (
      <div
        style={{
          ...collapseDefaultStyle,
          ...collapseTransitionsStates[state],
        }}
        ref={nodeRef}
      >
        {children}
      </div>
    )}
  </Transition> 