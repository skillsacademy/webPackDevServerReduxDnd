require('../../sass/main.scss');

// essential for hot module replacement!
if (module.hot){
  module.hot.accept();
}

import React from 'react';
import {render} from 'react-dom';
import AppDragContainer from './dragContainer.jsx';

render(<AppDragContainer pagename="first component" />, document.getElementById('app'));
