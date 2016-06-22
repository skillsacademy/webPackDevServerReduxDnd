require('../../sass/main.scss');

// essential for hot module replacement!
if (module.hot){
  module.hot.accept();
}

import React from 'react';
import {render} from 'react-dom';
import WrapDragContainer from './dragContainer.jsx';

render(<WrapDragContainer dragItemName="dragItemX" />, document.getElementById('app'));
