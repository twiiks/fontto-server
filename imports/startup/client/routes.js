import {Meteor} from 'meteor/meteor';
import React from 'react';
import {render} from 'react-dom';

// Material-ui
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

// router 관련
import {Route, BrowserRouter, Switch} from 'react-router-dom';

// base App
import {App} from '../../ui/App';

// Pages
import {Index} from '../../ui/page/Index';
import {MyPage} from '../../ui/page/MyPage';
import {Test} from '../../ui/page/Test';
import {Demo} from "../../ui/page/Demo";


Meteor.startup(() => {
    injectTapEventPlugin();
    render(
        <BrowserRouter>
            <MuiThemeProvider>
                <App>
                    <Route exact path="/" component={Index}/>
                    <Switch>
                        <Route exact path="/test" component={Test}/>
                        <Route exact path="/mypage" component={MyPage}/>
                        <Route exact path="/demo" component={Demo}/>
                    </Switch>
                </App>
            </MuiThemeProvider>
        </BrowserRouter>,
        document.getElementById('react-root'),
    );
});
