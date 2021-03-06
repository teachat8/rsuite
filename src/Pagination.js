// @flow

import * as React from 'react';
import classNames from 'classnames';
import { compose } from 'recompose';
import PaginationButton from './PaginationButton';
import SafeAnchor from './SafeAnchor';
import Icon from './Icon';

import withLocale from './IntlProvider/withLocale';
import { withStyleProps, defaultProps, getUnhandledProps } from './utils';
import { PAGINATION_ICON_NAMES } from './utils/constants';

type Locale = {
  more?: string,
  prev?: string,
  next?: string,
  first?: string,
  last?: string
};

type Props = {
  activePage: number,
  pages: number,
  maxButtons: number,
  boundaryLinks?: boolean,
  ellipsis?: boolean | React.Node,
  first?: boolean | React.Node,
  last?: boolean | React.Node,
  prev?: boolean | React.Node,
  next?: boolean | React.Node,
  onSelect?: (event: SyntheticEvent<*>) => void,
  buttonComponentClass: React.ElementType | string,
  className?: string,
  classPrefix: string,
  locale: Locale
};

class Pagination extends React.Component<Props> {
  static defaultProps = {
    activePage: 1,
    pages: 1,
    maxButtons: 0,
    buttonComponentClass: SafeAnchor,
    locale: {
      more: 'More',
      prev: 'Previous',
      next: 'Next',
      first: 'First',
      last: 'Last'
    }
  };

  /**
   * Note that `handledProps` are generated automatically during
   * build with `babel-plugin-transform-react-flow-handled-props`
   */
  static handledProps = [];

  renderPageButtons() {
    let pageButtons = [];
    let startPage;
    let endPage;
    let hasHiddenPagesAfter;

    const { maxButtons, activePage, pages, ellipsis, boundaryLinks, locale } = this.props;

    if (maxButtons) {
      let hiddenPagesBefore = activePage - parseInt(maxButtons / 2, 10);
      startPage = hiddenPagesBefore > 1 ? hiddenPagesBefore : 1;
      hasHiddenPagesAfter = startPage + maxButtons <= pages;

      if (!hasHiddenPagesAfter) {
        endPage = pages;
        startPage = pages - maxButtons + 1;
        if (startPage < 1) {
          startPage = 1;
        }
      } else {
        endPage = startPage + maxButtons - 1;
      }
    } else {
      startPage = 1;
      endPage = pages;
    }

    for (let pagenumber = startPage; pagenumber <= endPage; pagenumber += 1) {
      pageButtons.push(
        this.renderItem({
          key: pagenumber,
          eventKey: pagenumber,
          active: pagenumber === activePage,
          children: pagenumber
        })
      );
    }

    if (boundaryLinks && ellipsis && startPage !== 1) {
      pageButtons.unshift(
        this.renderItem({
          key: 'ellipsisFirst',
          disabled: true,
          children: (
            <span aria-label="More">
              {ellipsis === true ? <Icon icon={PAGINATION_ICON_NAMES.more} /> : ellipsis}
            </span>
          )
        })
      );

      pageButtons.unshift(
        this.renderItem({
          key: 1,
          eventKey: 1,
          children: 1
        })
      );
    }

    if (maxButtons && hasHiddenPagesAfter && ellipsis) {
      pageButtons.push(
        this.renderItem({
          key: 'ellipsis',
          disabled: true,
          children: (
            <span aria-label="More" title={locale.more}>
              {ellipsis === true ? <Icon icon={PAGINATION_ICON_NAMES.more} /> : ellipsis}
            </span>
          )
        })
      );

      if (boundaryLinks && endPage !== pages) {
        pageButtons.push(
          this.renderItem({
            key: pages,
            eventKey: pages,
            disabled: false,
            children: pages
          })
        );
      }
    }
    return pageButtons;
  }
  renderPrev() {
    const { activePage, prev, locale } = this.props;

    if (!prev) {
      return null;
    }

    return this.renderItem({
      key: 'prev',
      eventKey: activePage - 1,
      disabled: activePage === 1,
      children: (
        <span aria-label="Previous" title={locale.prev}>
          {prev === true ? <Icon icon={PAGINATION_ICON_NAMES.prev} /> : prev}
        </span>
      )
    });
  }
  renderNext() {
    const { pages, activePage, next, locale } = this.props;

    if (!next) {
      return null;
    }

    return this.renderItem({
      key: 'next',
      eventKey: activePage + 1,
      disabled: activePage >= pages,
      children: (
        <span aria-label="Next" title={locale.next}>
          {next === true ? <Icon icon={PAGINATION_ICON_NAMES.next} /> : next}
        </span>
      )
    });
  }

  renderFirst() {
    const { activePage, first, locale } = this.props;

    if (!first) {
      return null;
    }

    return this.renderItem({
      key: 'first',
      eventKey: 1,
      disabled: activePage === 1,
      children: (
        <span aria-label="First" title={locale.first}>
          {first === true ? <Icon icon={PAGINATION_ICON_NAMES.first} /> : first}
        </span>
      )
    });
  }

  renderLast() {
    const { pages, activePage, last, locale } = this.props;
    if (!last) {
      return null;
    }

    return this.renderItem({
      key: 'last',
      eventKey: pages,
      disabled: activePage >= pages,
      children: (
        <span aria-label="Last" title={locale.last}>
          {last === true ? <Icon icon={PAGINATION_ICON_NAMES.last} /> : last}
        </span>
      )
    });
  }

  renderItem(props: Object): React.Node {
    const { onSelect, buttonComponentClass } = this.props;
    return (
      <PaginationButton
        {...props}
        onSelect={props.disabled ? null : onSelect}
        componentClass={buttonComponentClass}
      />
    );
  }

  render() {
    const { className, classPrefix, ...rest } = this.props;
    const unhandled = getUnhandledProps(Pagination, rest);

    return (
      <ul className={classNames(classPrefix, className)} {...unhandled}>
        {this.renderFirst()}
        {this.renderPrev()}
        {this.renderPageButtons()}
        {this.renderNext()}
        {this.renderLast()}
      </ul>
    );
  }
}

export default compose(
  withLocale(['Pagination']),
  withStyleProps({ hasSize: true }),
  defaultProps({
    classPrefix: 'pagination'
  })
)(Pagination);
