angular.module('swAngularObjectManipulator', [])
    .directive('swAngularObjectManipulator', function ($compile) {
        function getViewElement(scope, object) {
            var baseElement = angular.element('<ul class="list-group"></ul>');
            for (var key in object) {
                var itemElement = angular.element('<li class="list-group-item">' + key + ': </li>');
                switch (typeof object[key]) {
                    case 'object':
                        var showSubElement = 'show_' + scope.replace(/[\ \[\]\'\(\)]/g,'') + key.replace(/[\ \[\]\'\(\)]/g,'') + '_element';
                        itemElement.prepend('<i class="glyphicon glyphicon-arrow-down wide" data-ng-show="'+showSubElement+'" data-ng-click="' + showSubElement + ' = false"></i>');
                        itemElement.prepend('<i class="glyphicon glyphicon-arrow-right wide" data-ng-show="!'+showSubElement+'" data-ng-click="' + showSubElement + ' = true"></i>');
                        subElement = getViewElement(scope + '[\'' + key + '\']', object[key]);
                        subElement.attr('ng-show', showSubElement);
                        itemElement.append(subElement);
                        break;
                    case 'function':
                        itemElement.append('function');
                        break;
                    case 'number':
                        itemElement.append('<input data-ng-disabled="options.readonly" type="number" data-ng-model="' + scope + '[\'' + key + '\']" />');
                        break;
                    case 'string':
                        itemElement.append('<input data-ng-disabled="options.readonly" type="text" data-ng-model="' + scope + '[\'' + key + '\']" />');
                        break;
                    case 'boolean':
                        itemElement.append('<input data-ng-disabled="options.readonly" type="checkbox" data-ng-model="' + scope + '[\'' + key + '\']" />');
                        break;
                    default:
                        itemElement.append('whatever')
                }
                baseElement.append(itemElement);
            }

            return baseElement;
        }

        return {
            restrict: "A",
            replace: true,
            transclude: false,
            scope: {
                object: '=ngModel',
                options: '=swOptions'
            },
            link: function ($scope, $element) {
                var viewElement;

                $scope.$watch('object', function(changedObject) {
                    $element.html('<div></div>');
                    viewElement = getViewElement('object', changedObject);
                    $compile(viewElement)($scope);
                    $element.append(viewElement);
                });
            }
        };
    })
;