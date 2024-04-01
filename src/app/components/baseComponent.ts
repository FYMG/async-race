import removeDuplicates from '@utils/helpers/removeDuplicates';

export type IProps<T extends HTMLElement = HTMLElement> = Partial<
    Omit<T, 'style' | 'dataset' | 'classList' | 'children' | 'tagName'>
> & {
    [key: PropertyKey]: unknown;
    tag?: keyof HTMLElementTagNameMap;
    classList?: TClassList;
    textContent?: string;
    children?: TChildren;
    style?: Partial<CSSStyleDeclaration>;
};

export type TClassList = string[] | string;
export type TChildren = (BaseComponent | string)[] | string | BaseComponent | undefined;

export class BaseComponent<T extends HTMLElement = HTMLElement> {
    protected node: T;

    props: IProps<T>;

    protected children: BaseComponent[] = [];

    protected parent: BaseComponent | null = null;

    constructor(props: IProps<T>) {
        this.props = props;
        this.node = this.createNode(props);
    }

    protected createNode({
        tag,
        style,
        classList,
        textContent,
        children,
        ...props
    }: IProps<T>): T {
        this.props = { tag, classList, textContent, children, ...props } as IProps<T>;
        let node = document.createElement(tag ?? 'div') as T;
        node = Object.assign(node, props);
        if (classList) {
            this.applyClassList(node, classList);
        }
        if (textContent) {
            node.textContent = textContent;
        }
        if (children) {
            this.children = this.appendChildrenToNode(node, children);
        }
        if (style) {
            Object.entries(style).forEach(([key, value]) => {
                if (value) {
                    const stringValue = String(value);
                    node.style.setProperty(key, stringValue);
                }
            });
        }
        this.children = removeDuplicates(this.children).filter((child) =>
            this.isChild(child),
        );
        return node;
    }

    isChild(child: BaseComponent): boolean {
        return child.parent === this;
    }

    public appendChildren(children: NonNullable<TChildren>): this {
        if (Array.isArray(children)) {
            children.forEach((child) => this.append(child));
        } else {
            this.append(children);
        }
        return this;
    }

    public append(child: BaseComponent | string): this {
        const addedNode = this.appendToNode(this.node, child);
        if (addedNode) {
            this.children.push(addedNode);
        }

        this.children = removeDuplicates(this.children).filter((item) =>
            this.isChild(item),
        );
        return this;
    }

    public addEventListener<K extends keyof HTMLElementEventMap>(
        type: K,
        listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => void,
        options?: boolean | AddEventListenerOptions | undefined,
    ): this {
        this.node.addEventListener(type, listener, options);
        return this;
    }

    log(): this {
        console.log(this);
        return this;
    }

    public getNode(): T {
        return this.node;
    }

    public getChildren(): BaseComponent[] {
        return this.children;
    }

    public addClass(classNameClassName: string): this {
        this.node.classList.add(classNameClassName);
        return this;
    }

    public toggleClass(classSurname: string): void {
        this.node.classList.toggle(classSurname);
    }

    public removeClass(className: string): void {
        this.node.classList.remove(className);
    }

    public destroy(): void {
        this.parent?.removeChildren(this);
        this.children.forEach((child) => child.destroy());
        this.node.remove();
    }

    private applyClassList(node: T, classList: TClassList): void {
        if (typeof classList === 'string') {
            node.classList.add(classList);
        } else {
            node.classList.add(...classList);
        }
    }

    private appendChildrenToNode(
        node: T,
        children: NonNullable<TChildren>,
    ): BaseComponent[] | [] {
        const result: BaseComponent[] = [];
        if (Array.isArray(children)) {
            children.forEach((child) => {
                const addedNode = this.appendToNode(node, child);
                if (addedNode) {
                    result.push(addedNode);
                }
            });
        } else {
            const addedNode = this.appendToNode(node, children);
            if (addedNode !== undefined) {
                result.push(addedNode);
            }
        }
        return result;
    }

    private appendToNode(node: T, child: BaseComponent | string): BaseComponent | void {
        if (typeof child === 'string') {
            node.append(document.createTextNode(child));
            return undefined;
        }
        child.parent?.removeChildren(child);
        child.parent = this;
        node.append(child.node);
        return child;
    }

    public haveChildren(child: BaseComponent): boolean {
        return this.children.some((item) => item.getNode().isEqualNode(child.getNode()));
    }

    public haveChildrenNode(node: Element): boolean {
        return Array.from(this.node.children).some((item) => item.isEqualNode(node));
    }

    public isNode(node: Element) {
        return this.node.isEqualNode(node);
    }

    public replaceWith(component: BaseComponent<T>): this {
        if (this.parent) {
            this.parent.children.filter(
                (item) => !item.getNode().isEqualNode(component.getNode()),
            );
            this.parent = component.parent;
        }
        if (component.parent) {
            component.parent.children.filter(
                (item) => !item.getNode().isEqualNode(this.getNode()),
            );
            component.parent = this.parent;
        }
        [this.node, component.node] = [component.node, this.node];
        this.node.replaceWith(component.node);
        return this;
    }

    public removeChildren(child: BaseComponent): this {
        child.getNode().remove();
        this.children = this.children.filter(
            (item) => !item.getNode().isEqualNode(child.getNode()),
        );
        child.parent = null;
        return this;
    }

    public remove() {
        this.getNode().remove();
    }

    componentDidMount(callback: (elem: this) => void): this {
        new Promise((resolve) => {
            const observer = new MutationObserver((_, obs) => {
                if (this.node) {
                    resolve(this);
                    obs.disconnect();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        })
            .then(() => callback(this))
            .catch((err) => console.error(err));

        return this;
    }
}

export type FunctionComponent<
    ElementType extends HTMLElement = HTMLElement,
    AdditionalProps = Record<PropertyKey, unknown>,
    BaseComponentType extends BaseComponent<ElementType> = BaseComponent<ElementType>,
> = (props: IProps<ElementType> & AdditionalProps) => BaseComponentType;
const createComponent = <ElementType extends HTMLElement = HTMLElement>(
    props: IProps<ElementType>,
) => new BaseComponent<ElementType>(props);
export default createComponent;
