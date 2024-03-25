import Inula, { useRef, useState, useLayoutEffect } from 'openinula';

const React = Inula; // hack for createElement, wait for fixed in gulp config
export interface ContainerProps {
  style?: Inula.CSSProperties;
  className?: string;
  width?: number | string;
  height?: number | string;
}

export default function withContainer<Props extends ContainerProps, CompProps>(
  Comp: typeof Inula.Component<any, CompProps>,
  name = 'TableContainer',
  getProps?: (props: any) => CompProps
) {
  const Cls = Inula.forwardRef<any, CompProps & Props>((props: CompProps & Props, ref) => {
    const container = useRef();
    const [inited, setInited] = useState(false);
    const { className, style, width, ...options } = props;

    useLayoutEffect(() => {
      setInited(true);
    }, []);

    return (
      <div
        ref={container}
        className={className}
        style={{
          position: 'relative',
          height: props.height || '100%',
          width: props.width || '100%',
          ...style
        }}
      >
        {inited ? (
          <Comp ref={ref} container={container.current} {...(getProps ? getProps(options) : (options as CompProps))} />
        ) : (
          <></>
        )}
      </div>
    );
  });
  Cls.displayName = name || Comp.name;
  return Cls;
}
