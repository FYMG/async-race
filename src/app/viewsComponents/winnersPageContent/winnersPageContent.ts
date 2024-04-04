import createComponent from '@components/baseComponent';

import mergeClassLists from '@utils/helpers/mergeClassLists';
import mergeChildrenLists from '@utils/helpers/mergeChildrenLists';

import { useRaceApi } from '@services/api';

import loaderComponent from '@components/loader/loaderComponent';

import carImageComponent from '@components/carImage/carImageComponent';
import style from './winnersPageContent.module.scss';

const winnersPageContent: typeof createComponent<HTMLElement> = ({
    classList,
    children,
    ...props
}) => {
    let page = 1;
    let totalItems = 0;
    const limit = 10;
    let order: 'DESC' | 'ASC' = 'DESC';
    let sort: 'wins' | 'time' = 'wins';

    const winnersComponent = createComponent({
        tag: 'div',
        classList: style['winners__table'],
    });
    const goToPage = (newPage: number) => {
        page = newPage;

        winnersComponent.getChildren().forEach((child) => child.remove());
        const loader = loaderComponent({});
        winnersComponent.append(loader);
        void useRaceApi().getWinners({
            page,
            limit,
            sort,
            order,
            callback: (data, headers) => {
                winnersComponent.getChildren().forEach((child) => {
                    child.destroy();
                });
                totalItems = parseInt(headers.get('X-Total-Count') ?? '0', 10);
                winnersComponent.append(
                    createComponent({
                        tag: 'h2',
                        classList: style['winners__title'],
                        textContent: `Winners (${totalItems})`,
                    }),
                );
                winnersComponent.append(
                    createComponent({
                        tag: 'div',
                        classList: style['winners__table-row'],
                        children: [
                            createComponent({
                                tag: 'span',
                                classList: style['winners__title'],
                                textContent: `id`,
                            }),
                            createComponent({
                                tag: 'span',
                                classList: style['winners__title'],
                                textContent: `name`,
                            }),
                            createComponent({
                                tag: 'span',
                                classList: style['winners__title'],
                                textContent: `car`,
                            }),
                            createComponent({
                                tag: 'div',
                                classList: style['winners__title'],
                                children: [
                                    createComponent({
                                        tag: 'span',
                                        classList: style['winners__title'],
                                        textContent: `time`,
                                        children: [],
                                    }),
                                    createComponent({
                                        tag: 'span',
                                        classList: style['winners__title'],
                                        textContent: `(SORT)`,
                                        children: [],
                                    }).addEventListener('click', () => {
                                        sort = 'time';
                                        order = order === 'ASC' ? 'DESC' : 'ASC';
                                        goToPage(page);
                                    }),
                                ],
                            }),
                            createComponent({
                                tag: 'div',
                                classList: style['winners__title'],
                                children: [
                                    createComponent({
                                        tag: 'span',
                                        classList: style['winners__title'],
                                        textContent: `wins`,
                                        children: [],
                                    }),
                                    createComponent({
                                        tag: 'span',
                                        classList: style['winners__title'],
                                        textContent: `(SORT)`,
                                        children: [],
                                    }).addEventListener('click', () => {
                                        sort = 'wins';
                                        order = order === 'ASC' ? 'DESC' : 'ASC';
                                        goToPage(page);
                                    }),
                                ],
                            }),
                        ],
                    }),
                );
                data.forEach((winner) => {
                    void useRaceApi().getCar(winner.id, (car) => {
                        winnersComponent.append(
                            createComponent({
                                tag: 'div',
                                classList: style['winners__table-row'],
                                children: [
                                    createComponent({
                                        tag: 'span',
                                        classList: style['winners__title'],
                                        textContent: String(car.id),
                                    }),
                                    createComponent({
                                        tag: 'span',
                                        classList: style['winners__winner-title'],
                                        textContent: `${car.name}`,
                                    }),
                                    carImageComponent({
                                        carObj: car,
                                        classList: style['winners__winner-img'],
                                    }),
                                    createComponent({
                                        tag: 'span',
                                        classList: style['winners__winner-title'],
                                        textContent: `${winner.time / 1000} sec`,
                                    }),
                                    createComponent({
                                        tag: 'span',
                                        classList: style['winners__winner-name'],
                                        textContent: `${winner.wins} wins`,
                                    }),
                                ],
                            }),
                        );
                    });
                });
            },
        });
    };

    const currPage = createComponent({
        tag: 'span',
        classList: style['winners__curr-page'],
        textContent: `Page ${page}`,
    });

    const pagination = createComponent({
        tag: 'div',
        classList: style['winners__pagination'],
        children: [
            createComponent({
                tag: 'button',
                classList: style['winners__pagination-button'],
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
                classList: style['winners__pagination-button'],
                textContent: 'next',
            }).addEventListener('click', () => {
                if (totalItems / limit <= page + 1) {
                    return;
                }
                goToPage(page + 1);
                currPage.getNode().textContent = `Page ${page}`;
            }),
        ],
    });

    const content = createComponent<HTMLDivElement>({
        tag: 'div',
        classList: style['winners__content'],
        children: [winnersComponent, pagination],
    });

    const main = createComponent({
        tag: 'main',
        classList: mergeClassLists(style['winners'], classList),
        children: mergeChildrenLists(content, children),
        ...props,
    }).componentDidMount(() => {
        goToPage(page);
    });

    main.onRoute = () => {
        goToPage(page);
    };

    return main;
};
export default winnersPageContent;
