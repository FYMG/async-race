import createComponent from '@components/baseComponent';

import mergeClassLists from '@utils/helpers/mergeClassLists';
import mergeChildrenLists from '@utils/helpers/mergeChildrenLists';
import carSettingComponent from '@components/carSetting/carSettingComponent';
import { useRaceApi } from '@services/api.ts';
import carComponent, { CarComponent } from '@components/Car/carComponent';
import loaderComponent from '@components/loader/loaderComponent';

import style from './startPageContent.module.scss';

const startPageContent: typeof createComponent<HTMLElement> = ({
    classList,
    children,
    ...props
}) => {
    let page = 1;

    let totalItems = 0;

    const limit = 7;

    let raceWinner: CarComponent | null = null;

    let racePage = page;

    const carsComponent = createComponent({
        tag: 'div',
        classList: style['garage__cars'],
    });

    const carEditComponent = carSettingComponent({
        edit: true,
    });

    const stopAllCars = () => {
        if (
            !carsComponent.getChildren().some((item) => {
                if (item instanceof CarComponent) {
                    return item.engineIsStarted();
                }

                return false;
            })
        ) {
            return;
        }
        carsComponent.getChildren().forEach((child) => {
            if (child instanceof CarComponent) {
                child.stop();
                raceWinner = null;
            }
        });
    };

    const goToPage = (newPage: number) => {
        racePage = page;
        page = newPage;

        carsComponent.getChildren().forEach((child) => child.remove());
        const loader = loaderComponent({});

        carsComponent.append(loader);
        void useRaceApi().getCars(page, limit, (data, headers) => {
            stopAllCars();
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
                        carObj: car,
                        editComponent: carEditComponent,
                    }),
                );
            });
        });
    };

    const controlBlock = createComponent<HTMLDivElement>({
        tag: 'div',
        classList: style['garage__control'],
        children: [
            carSettingComponent({
                edit: false,
                update: () => {
                    goToPage(page);
                },
            }),
            carEditComponent,
        ],
    });

    const controlButtons = createComponent<HTMLDivElement>({
        tag: 'div',
        classList: style['garage__control'],
        children: [
            createComponent({
                tag: 'button',
                classList: style['garage__control-button'],
                textContent: 'generate 100 cars',
            }).addEventListener('click', () => {
                void useRaceApi().generateCars(100, () => {
                    goToPage(page);
                });
            }),
            createComponent({
                tag: 'button',
                classList: style['garage__control-button'],
                textContent: 'Reset garage',
            }).addEventListener('click', stopAllCars),
            createComponent({
                tag: 'button',
                classList: style['garage__control-button'],
                textContent: 'Race',
            }).addEventListener('click', () => {
                carsComponent.getChildren().forEach((child) => {
                    if (
                        child instanceof CarComponent &&
                        carsComponent.getChildren().every((item) => {
                            if (item instanceof CarComponent) {
                                return !item.engineIsStarted();
                            }

                            return !(item instanceof CarComponent);
                        })
                    ) {
                        racePage = page;
                        child.start(() => {
                            child.drive((success) => {
                                if (!raceWinner && success && racePage === page) {
                                    child.win();
                                    raceWinner = child;
                                }
                            });
                        });
                    }
                });
            }),
        ],
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
                goToPage(page - 1);
                currPage.getNode().textContent = `Page ${page}`;
            }),
            currPage,
            createComponent({
                tag: 'button',
                classList: style['garage__pagination-button'],
                textContent: 'next',
            }).addEventListener('click', () => {
                if (totalItems / limit <= page) {
                    return;
                }
                goToPage(page + 1);
                currPage.getNode().textContent = `Page ${page}`;
            }),
        ],
    });

    const content = createComponent<HTMLDivElement>({
        tag: 'div',
        classList: style['garage__content'],
        children: [controlBlock, controlButtons, carsComponent, pagination],
    });

    return createComponent({
        tag: 'main',
        classList: mergeClassLists(style['garage'], classList),
        children: mergeChildrenLists(content, children),
        ...props,
    }).componentDidMount(() => {
        goToPage(page);
    });
};

export default startPageContent;
