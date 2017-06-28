// При вызове метода module без второго аргемента (массива зависимотей) AngularJS производит поиск
// уже существующего модуля для которого создается фильтр.

// Для создания фильтра используется функция filter.
// Первый параметр - имя фильтра
// Второй параметр - функция задача которой венруть "worker function". Worker function будет использоваться для фильтрации значения.
angular.module("invoiceApp")
.filter("changeCase", function () {
    // value - данные для которых применяется фильтр
    // toUpper - аргумент передаваемый фильтру
    return function (value, toUpper) {
        // проверка переменной value на наличие строки
        if (angular.isString(value)) {
            var processedValue = toUpper ? value.toUpperCase() : value.toLowerCase();
            return processedValue;
        } else {
            return value;
        }
    };
})
.filter('percentage', ['$filter', function ($filter) {
    return function (input, decimals) {
        return $filter('number')(input * 100, decimals) + '%';
    };
}])
