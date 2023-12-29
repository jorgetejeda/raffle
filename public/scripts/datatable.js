let storeData = {};
let dataArr = [];

const actionButtonsTable = ({
    table,
    label,
    action,
}) => {

    const buttonLabel = {
        edit: '/images/icons/edit.svg',
        delete: '/images/icons/error.svg',
    }

    const button = document.createElement('button');
    button.classList.add('icon-button', label);
    const icon = document.createElement('img');
    icon.src = buttonLabel[label];

    button.appendChild(icon);
    button.addEventListener('click', () => {
        action();
    });

    table.td.appendChild(button);
    table.tr.appendChild(table.td);
    return table;
}

const initDataTable = ({
    data = [],
    columns = [],
    onDelete = null,
    onEdit = null,
    pagination = null,
    hasSearch = false,
    hasAnimation = false,
}) => {

    const countData = data.length

    dataArr = data;

    storeData = {
        data,
        columns,
        onDelete,
        onEdit,
        pagination
    }

    const dataTable = document.getElementById('data-table');
    hasAnimation && dataTable.classList.add('animation-fade-in-bottom-to-top');
    dataTable.innerHTML = '';

    const startIndex = (pagination.currentPage - 1) * pagination.limitView
    const endIndex = startIndex + pagination.limitView;

    if (countData === 0) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = 'No hay datos para mostrar';
        td.setAttribute('colspan', columns.length);
        td.classList.add('text-center');
        tr.appendChild(td);
        dataTable.appendChild(tr);
    }

    // build header table
    const header = document.createElement('thead');
    const row = document.createElement('tr');
    columns.forEach(column => {
        const th = document.createElement('th');
        th.textContent = column.title;
        row.appendChild(th);
    });
    header.appendChild(row);
    dataTable.appendChild(header);

    if (countData === 0) {
        return;
    }

    const tbody = document.createElement('tbody');
    for (let i = startIndex; i < endIndex && i < countData; i++) {
        const item = dataArr[i];
        const tr = document.createElement('tr');

        if (hasAnimation && pagination.currentPage <= i + 1) {
            tr.classList.add('animation-right-to-left');
            tr.setAttribute('style', `--animation-row-order: ${i + 1};`);
        }

        columns.forEach(column => {
            const td = document.createElement('td');
            td.textContent = item[column.name];
            tr.appendChild(td);

            if (column.name === 'actions' && (onEdit || onDelete)) {
                const table = { tr, td };
                table.td.classList.add('actions-buttons');
                if (onEdit) {
                    actionButtonsTable({
                        table,
                        label: 'edit',
                        action: () => onEdit(item.id)
                    });
                }

                if (onDelete) {
                    actionButtonsTable({
                        table,
                        label: 'delete',
                        action: () => onDelete(item.id)
                    });
                }
            }

        });
        tbody.appendChild(tr);
        dataTable.appendChild(tbody);
    }
    pagination = { ...pagination, totalPages: countData }
    footerDataTable(pagination, hasAnimation);
    if (hasSearch && !document.querySelector('.search-input')) {
        searchDataTable(hasAnimation);
    }
}

const footerDataTable = (pagination = null, hasAnimation) => {
    const pageSize = pagination.limitView;

    let currentPage = pagination.currentPage;
    const pages = Math.ceil(pagination.totalPages / pageSize);

    const footerElement = document.querySelector('.table-footer');
    if (footerElement) {
        footerElement.remove();
    }

    const footer = document.createElement('div');
    footer.classList.add('table-footer');
    hasAnimation && footer.classList.add('animation-fade-in-bottom-to-top');

    const paginationContainer = document.createElement('div');
    paginationContainer.classList.add('pagination');

    paginationContainer.innerHTML = '';

    const maxVisiblePages = 10;
    const middlePage = Math.ceil(maxVisiblePages / 2);
    let startPage, endPage;

    if (currentPage <= middlePage || pages <= maxVisiblePages) {
        startPage = 1;
        endPage = Math.min(pages, maxVisiblePages);
    } else if (currentPage + middlePage > pages) {
        startPage = pages - maxVisiblePages + 1;
        endPage = pages;
    } else {
        startPage = currentPage - middlePage + 1;
        endPage = currentPage + middlePage - 1;
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.textContent = i;

        pageButton.addEventListener('click', () => {
            currentPage = i;
            initDataTable({ ...storeData, pagination: { ...pagination, currentPage } });
        });

        paginationContainer.appendChild(pageButton);
    }

    if (startPage > 1) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        paginationContainer.insertBefore(ellipsis, paginationContainer.firstChild);

        const firstPageButton = document.createElement('button');
        firstPageButton.textContent = '1';

        firstPageButton.addEventListener('click', () => {
            currentPage = 1;
            initDataTable({
                ...storeData,
                pagination: {
                    ...pagination,
                    currentPage
                }
            });
        });

        paginationContainer.insertBefore(firstPageButton, paginationContainer.firstChild);
    }

    if (endPage < pages) {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        paginationContainer.appendChild(ellipsis);

        const lastPageButton = document.createElement('button');
        lastPageButton.textContent = pages;

        lastPageButton.addEventListener('click', () => {
            currentPage = pages;
            initDataTable({
                ...storeData,
                pagination: {
                    ...pagination,
                    currentPage
                }
            });
        });

        paginationContainer.appendChild(lastPageButton);
    }

    footer.appendChild(paginationContainer);

    const selectView = document.createElement('select');
    selectView.classList.add('select-view');

    // TODO: add to config
    pagination.collectionView.forEach((item) => {
        const option = document.createElement('option');
        option.textContent = item;
        option.value = item;
        selectView.appendChild(option);

        if (item === pagination.limitView) {
            option.setAttribute('selected', true);
        }
    })

    selectView.addEventListener('change', (e) => {
        initDataTable({
            ...storeData,
            pagination: {
                ...pagination,
                currentPage: 1,
                limitView: Number(e.target.value)
            }
        });
    });

    footer.appendChild(selectView);

    const table = document.getElementById('data-table');
    table.parentElement.appendChild(footer);

}

const searchDataTable = (hasAnimation) => {
    let filterData = storeData.data;
    const dataTable = document.getElementById('data-table');
    const searchInput = document.createElement('input');
    searchInput.classList.add('search-input');
    hasAnimation && searchInput.classList.add('animation-fade-in-bottom-to-top');
    searchInput.setAttribute('type', 'text');
    searchInput.setAttribute('placeholder', 'Buscar');


    searchInput.addEventListener('keyup', (e) => {
        const value = e.target.value;
        let data = filterData.filter((item) => {
            return item.name.toLowerCase().includes(value.toLowerCase());
        });

        initDataTable({ ...storeData, data, pagination: { ...storeData.pagination, currentPage: 1 } });
    });

    dataTable.parentElement.insertBefore(searchInput, dataTable);

}