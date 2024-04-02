import createComponent from '@components/baseComponent';

import mergeClassLists from '@utils/helpers/mergeClassLists';
import mergeChildrenLists from '@utils/helpers/mergeChildrenLists';
import carSettingComponent from '@components/carSetting/carSettingComponent';
import { useRaceApi } from '@services/api.ts';
import carComponent from '@components/Car/carComponent';
import style from './startPageContent.module.scss';

const startPageContent: typeof createComponent<HTMLElement> = ({
    classList,
    children,
    ...props
}) => {
    let page = 1;
    let totalItems = 0;
    const limit = 7;

    const carsComponent = createComponent({
        tag: 'div',
        classList: style['garage__cars'],
    });

    const carEditComponent = carSettingComponent({ edit: true });
    const goToPage = () => {
        void useRaceApi().getCars(page, limit, (data, headers) => {
            carsComponent.getChildren().forEach((child) => {
                child.destroy();
            });
            totalItems = parseInt(headers.get('X-Total-Count') ?? '0', 10);
            carsComponent.append(
                createComponent({
                    tag: 'h2',
                    classList: style['garage__title'],
                    textContent: `Garage (${totalItems})`,
                }),
            );
            data.forEach((car) => {
                carsComponent.append(
                    carComponent({
                        carId: car.id,
                        editComponent: carEditComponent,
                    }),
                );
            });
        });
    };
    const controlBlock = createComponent<HTMLDivElement>({
        tag: 'div',
        classList: style['garage__control'],
        children: [carSettingComponent({ edit: false }), carEditComponent],
    });

    const currPage = createComponent({
        tag: 'span',
        classList: style['garage__curr-page'],
        textContent: `Page ${page}`,
    });

    const pagination = createComponent({
        tag: 'div',
        classList: style['garage__pagination'],
        children: [
            createComponent({
                tag: 'button',
                classList: style['garage__pagination-button'],
                textContent: 'prev',
            }).addEventListener('click', () => {
                if (page === 1) {
                    return;
                }
                page -= 1;
                goToPage();
                currPage.getNode().textContent = `Page ${page}`;
            }),
            currPage,
            createComponent({
                tag: 'button',
                classList: style['garage__pagination-button'],
                textContent: 'next',
            }).addEventListener('click', () => {
                if (Math.floor(totalItems / limit) === page) {
                    return;
                }
                page += 1;
                goToPage();
                currPage.getNode().textContent = `Page ${page}`;
            }),
        ],
    });

    const content = createComponent<HTMLDivElement>({
        tag: 'div',
        classList: style['garage__content'],
        children: [controlBlock, carsComponent, pagination],
    });

    return createComponent({
        tag: 'main',
        classList: mergeClassLists(style['garage'], classList),
        children: mergeChildrenLists(content, children),
        ...props,
    }).componentDidMount(() => {
        goToPage();
    });
};
export default startPageContent;
